import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi.testclient import TestClient
import uuid
from datetime import datetime, timezone

from app.main import app
from app.models.schemas import SearchRequest, SearchResponse, SearchResultItem


# ========================================================================
# HEALTH CHECK TESTS
# ========================================================================

class TestHealthEndpoints:
    """Test health check endpoints."""
    
    def test_health_basic(self, test_client: TestClient):
        """Test basic health check endpoint."""
        response = test_client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") in ["healthy", "alive", "ok"]
    
    def test_root_endpoint(self, test_client: TestClient):
        """Test root endpoint."""
        response = test_client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "running"
        assert "service" in data
        assert "version" in data
        assert "docs_url" in data


# ========================================================================
# SEARCH API TESTS
# ========================================================================

class TestSearchAPI:
    """Test search endpoint with comprehensive scenarios."""
    
    @pytest.mark.asyncio
    @pytest.mark.unit
    async def test_search_empty_query(self, test_client: TestClient):
        """Test search with empty query returns error."""
        response = test_client.post(
            "/api/search",
            json={"query": ""}
        )
        assert response.status_code == 400
        assert "empty" in response.json().get("detail", "").lower()
    
    @pytest.mark.asyncio
    @pytest.mark.unit
    async def test_search_query_too_long(
        self, 
        test_client: TestClient,
        mock_get_settings
    ):
        """Test search with query exceeding max length."""
        long_query = "x" * (mock_get_settings.MAX_QUERY_LENGTH + 1)
        response = test_client.post(
            "/api/search",
            json={"query": long_query}
        )
        assert response.status_code == 400
        assert "too long" in response.json().get("detail", "").lower()
    
    @pytest.mark.asyncio
    @pytest.mark.unit
    async def test_search_valid_query_no_results(
        self,
        test_client: TestClient,
        mock_embeddings_service,
        mock_expansion_service,
        sample_search_request,
    ):
        """Test search with valid query but no results."""
        with patch("app.db.mongo.get_testcase_collection") as mock_col:
            mock_collection = AsyncMock()
            mock_collection.aggregate.return_value.to_list = AsyncMock(return_value=[])
            mock_col.return_value = mock_collection
            
            response = test_client.post(
                "/api/search",
                json=sample_search_request.dict()
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["results_count"] == 0
            assert data["results"] == []
            assert data["query"] == sample_search_request.query
    
    @pytest.mark.asyncio
    @pytest.mark.unit
    async def test_search_with_feature_filter(
        self,
        test_client: TestClient,
        sample_search_request,
    ):
        """Test search with feature filter."""
        search_data = sample_search_request.dict()
        search_data["feature"] = "Authentication"
        
        with patch("app.db.mongo.get_testcase_collection") as mock_col:
            mock_collection = AsyncMock()
            mock_collection.aggregate.return_value.to_list = AsyncMock(return_value=[])
            mock_col.return_value = mock_collection
            
            response = test_client.post("/api/search", json=search_data)
            
            assert response.status_code == 200
            data = response.json()
            assert data["feature_filter"] == "Authentication"
    
    @pytest.mark.asyncio
    @pytest.mark.unit
    async def test_search_ranking_variants(
        self,
        test_client: TestClient,
        sample_search_request,
    ):
        """Test search with different ranking variants."""
        for variant in ["A", "B", "a", "b"]:
            search_data = sample_search_request.dict()
            search_data["ranking_variant"] = variant
            
            with patch("app.db.mongo.get_testcase_collection") as mock_col:
                mock_collection = AsyncMock()
                mock_collection.aggregate.return_value.to_list = AsyncMock(return_value=[])
                mock_col.return_value = mock_collection
                
                response = test_client.post("/api/search", json=search_data)
                
                assert response.status_code == 200
                data = response.json()
                assert data["ranking_variant"] in ["A", "B"]
    
    @pytest.mark.asyncio
    @pytest.mark.unit
    async def test_search_cache_hit(
        self,
        test_client: TestClient,
        sample_search_request,
    ):
        """Test search cache hit."""
        expected_cache_data = {
            "query": sample_search_request.query,
            "feature_filter": None,
            "results_count": 2,
            "results": [],
            "ranking_variant": "A",
        }
        
        with patch("app.core.cache.cache_get") as mock_cache_get:
            with patch("app.db.mongo.get_testcase_collection"):
                mock_cache_get.return_value = expected_cache_data
                
                response = test_client.post(
                    "/api/search",
                    json=sample_search_request.dict()
                )
                
                assert response.status_code == 200
                data = response.json()
                assert data["from_cache"] == True
    
    @pytest.mark.asyncio
    @pytest.mark.unit
    async def test_search_response_structure(
        self,
        test_client: TestClient,
        sample_search_request,
        sample_search_result_items,
    ):
        """Test search response has correct structure."""
        with patch("app.db.mongo.get_testcase_collection") as mock_col:
            with patch("app.core.cache.cache_get", return_value=None):
                with patch("app.services.embeddings.embed_text") as mock_embed:
                    with patch("app.services.ranking.build_candidates"):
                        with patch("app.services.ranking.select_final_results"):
                            with patch("app.services.finalRanking.final_llm_rerank", new_callable=AsyncMock) as mock_rerank:
                                mock_embed.return_value = [0.1] * 384
                                mock_rerank.return_value = sample_search_result_items
                                
                                # Mock collection to return search results
                                mock_collection = AsyncMock()
                                mock_results = [
                                    {
                                        "score": 0.95,
                                        "document": {
                                            "_id": item.id,
                                            "Test Case ID": item.test_case_id,
                                            "Feature": item.feature,
                                        }
                                    }
                                    for item in sample_search_result_items
                                ]
                                mock_collection.aggregate.return_value.to_list = AsyncMock(
                                    return_value=mock_results
                                )
                                mock_col.return_value = mock_collection
                                
                                response = test_client.post(
                                    "/api/search",
                                    json=sample_search_request.dict()
                                )
                                
                                assert response.status_code == 200
                                data = response.json()
                                
                                # Validate response structure
                                assert "query" in data
                                assert "results_count" in data
                                assert "results" in data
                                assert "from_cache" in data
                                assert "ranking_variant" in data
                                assert isinstance(data["results"], list)


# ========================================================================
# UPLOAD API TESTS
# ========================================================================

class TestUploadAPI:
    """Test file upload endpoint."""
    
    @pytest.mark.unit
    def test_upload_invalid_file_type(self, test_client: TestClient):
        """Test upload with invalid file type."""
        # Try to upload a txt file
        response = test_client.post(
            "/api/upload",
            files={"file": ("test.txt", b"invalid content")}
        )
        assert response.status_code == 400
        assert "Invalid file type" in response.json().get("detail", "")
    
    @pytest.mark.unit
    def test_upload_csv_missing_required_column(self, test_client: TestClient, create_csv_file):
        """Test CSV upload missing required columns."""
        csv_path = create_csv_file(
            "test.csv",
            [
                {"Feature": "Login", "Description": "Test login"},
                # Missing "Test Case ID" and "Playwright Scripts"
            ]
        )
        
        with open(csv_path, "rb") as f:
            response = test_client.post(
                "/api/upload",
                files={"file": ("test.csv", f)}
            )
        
        assert response.status_code == 400
        assert "Test Case ID" in response.json().get("detail", "")
    
    @pytest.mark.unit
    def test_upload_excel_missing_required_column(self, test_client: TestClient, create_excel_file):
        """Test Excel upload missing required columns."""
        excel_path = create_excel_file(
            "test.xlsx",
            [
                {"Feature": "Login", "Description": "Test login"},
            ]
        )
        
        with open(excel_path, "rb") as f:
            response = test_client.post(
                "/api/upload",
                files={"file": ("test.xlsx", f)}
            )
        
        assert response.status_code == 400
    
    @pytest.mark.unit
    @pytest.mark.asyncio
    async def test_upload_valid_csv(
        self,
        test_client: TestClient,
        create_csv_file,
        mock_upload_pipeline_mocks,
    ):
        """Test valid CSV upload."""
        csv_path = create_csv_file(
            "valid.csv",
            [
                {
                    "Test Case ID": "TC001",
                    "Feature": "Authentication",
                    "Test Case Description": "Test login",
                    "Pre-requisites": "User account exists",
                    "Playwright Scripts": "async function() { /* test */ }",
                    "Step No.": "1",
                    "Test Step": "Go to login",
                    "Expected Result": "Login page loads",
                },
            ]
        )
        
        with patch("app.db.mongo.get_testcase_collection") as mock_tc_col:
            with patch("app.db.mongo.get_playwright_scripts_collection") as mock_sc_col:
                mock_tc_collection = AsyncMock()
                mock_sc_collection = AsyncMock()
                
                mock_tc_collection.insert_many = AsyncMock(
                    return_value=MagicMock(inserted_ids=[str(uuid.uuid4())])
                )
                mock_sc_collection.insert_many = AsyncMock(
                    return_value=MagicMock(inserted_ids=[str(uuid.uuid4())])
                )
                
                mock_tc_col.return_value = mock_tc_collection
                mock_sc_col.return_value = mock_sc_collection
                
                with open(csv_path, "rb") as f:
                    response = test_client.post(
                        "/api/upload",
                        files={"file": ("valid.csv", f)}
                    )
                
                assert response.status_code == 200
                data = response.json()
                assert "testcases_inserted" in data
                assert "scripts_inserted" in data
                assert "duplicates_skipped" in data
    
    @pytest.mark.unit
    @pytest.mark.asyncio
    async def test_upload_file_too_large(self, test_client: TestClient):
        """Test upload with file exceeding size limit."""
        # Create a large file content
        large_content = b"x" * (11 * 1024 * 1024)  # 11 MB (exceeds 10 MB limit)
        
        response = test_client.post(
            "/api/upload",
            files={"file": ("large.csv", large_content)}
        )
        
        assert response.status_code == 413
        assert "too large" in response.json().get("detail", "").lower()
    
    @pytest.mark.unit
    @pytest.mark.asyncio
    async def test_upload_empty_scripts(self, test_client: TestClient, create_csv_file):
        """Test upload with empty Playwright scripts."""
        csv_path = create_csv_file(
            "empty_scripts.csv",
            [
                {
                    "Test Case ID": "TC001",
                    "Feature": "Authentication",
                    "Test Case Description": "Test login",
                    "Pre-requisites": "User account exists",
                    "Playwright Scripts": "",  # Empty script
                },
            ]
        )
        
        with open(csv_path, "rb") as f:
            response = test_client.post(
                "/api/upload",
                files={"file": ("empty_scripts.csv", f)}
            )
        
        assert response.status_code == 400
        assert "Empty Playwright Script" in response.json().get("detail", "")


# ========================================================================
# ERROR HANDLING TESTS
# ========================================================================

class TestErrorHandling:
    """Test error handling and edge cases."""
    
    @pytest.mark.unit
    def test_search_invalid_json(self, test_client: TestClient):
        """Test search with invalid JSON."""
        response = test_client.post(
            "/api/search",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        assert response.status_code in [400, 422]
    
    @pytest.mark.unit
    def test_search_missing_required_field(self, test_client: TestClient):
        """Test search missing required field."""
        response = test_client.post(
            "/api/search",
            json={"feature": "Authentication"}  # Missing 'query'
        )
        assert response.status_code == 422
    
    @pytest.mark.unit
    def test_invalid_endpoint(self, test_client: TestClient):
        """Test request to invalid endpoint."""
        response = test_client.get("/api/nonexistent")
        assert response.status_code == 404
    
    @pytest.mark.asyncio
    @pytest.mark.unit
    async def test_search_embedding_failure(
        self,
        test_client: TestClient,
        sample_search_request,
    ):
        """Test search when embedding fails."""
        with patch("app.services.embeddings.embed_text") as mock_embed:
            mock_embed.side_effect = Exception("Embedding service down")
            
            with patch("app.db.mongo.get_testcase_collection"):
                with patch("app.core.cache.cache_get", return_value=None):
                    response = test_client.post(
                        "/api/search",
                        json=sample_search_request.dict()
                    )
                    
                    assert response.status_code == 500
                    assert "Embedding" in response.json().get("detail", "")


# ========================================================================
# REQUEST VALIDATION TESTS
# ========================================================================

class TestRequestValidation:
    """Test request validation."""
    
    @pytest.mark.unit
    def test_search_request_with_tags(self, test_client: TestClient):
        """Test search request with tags."""
        response = test_client.post(
            "/api/search",
            json={
                "query": "login test",
                "tags": ["smoke", "critical"]
            }
        )
        assert response.status_code in [200, 400, 422]  # Depends on implementation
    
    @pytest.mark.unit
    def test_search_request_with_all_fields(self, test_client: TestClient):
        """Test search request with all optional fields."""
        with patch("app.db.mongo.get_testcase_collection") as mock_col:
            with patch("app.core.cache.cache_get", return_value=None):
                with patch("app.services.embeddings.embed_text"):
                    with patch("app.services.ranking.build_candidates"):
                        with patch("app.services.ranking.select_final_results"):
                            with patch("app.services.finalRanking.final_llm_rerank", new_callable=AsyncMock):
                                mock_collection = AsyncMock()
                                mock_collection.aggregate.return_value.to_list = AsyncMock(return_value=[])
                                mock_col.return_value = mock_collection
                                
                                response = test_client.post(
                                    "/api/search",
                                    json={
                                        "query": "login test",
                                        "feature": "Authentication",
                                        "tags": ["smoke"],
                                        "priority": "High",
                                        "platform": "Web",
                                        "ranking_variant": "B"
                                    }
                                )
                                
                                assert response.status_code == 200


# ========================================================================
# PERFORMANCE & EDGE CASE TESTS
# ========================================================================

class TestPerformanceAndEdgeCases:
    """Test performance and edge cases."""
    
    @pytest.mark.unit
    def test_search_special_characters(self, test_client: TestClient):
        """Test search with special characters."""
        queries = [
            "login@#$%^&*()",
            "test & (validation)",
            "query with \"quotes\"",
            "search/with\\slashes",
        ]
        
        with patch("app.db.mongo.get_testcase_collection") as mock_col:
            with patch("app.core.cache.cache_get", return_value=None):
                with patch("app.services.embeddings.embed_text"):
                    with patch("app.services.ranking.build_candidates"):
                        with patch("app.services.ranking.select_final_results"):
                            with patch("app.services.finalRanking.final_llm_rerank", new_callable=AsyncMock):
                                mock_collection = AsyncMock()
                                mock_collection.aggregate.return_value.to_list = AsyncMock(return_value=[])
                                mock_col.return_value = mock_collection
                                
                                for query in queries:
                                    response = test_client.post(
                                        "/api/search",
                                        json={"query": query}
                                    )
                                    assert response.status_code in [200, 400, 422]
    
    @pytest.mark.unit
    def test_search_unicode_characters(self, test_client: TestClient):
        """Test search with unicode characters."""
        queries = [
            "测试登录",  # Chinese
            "テストログイン",  # Japanese
            "тест входа",  # Russian
            "ทดสอบการเข้าสู่ระบบ",  # Thai
        ]
        
        with patch("app.db.mongo.get_testcase_collection") as mock_col:
            with patch("app.core.cache.cache_get", return_value=None):
                with patch("app.services.embeddings.embed_text"):
                    with patch("app.services.ranking.build_candidates"):
                        with patch("app.services.ranking.select_final_results"):
                            with patch("app.services.finalRanking.final_llm_rerank", new_callable=AsyncMock):
                                mock_collection = AsyncMock()
                                mock_collection.aggregate.return_value.to_list = AsyncMock(return_value=[])
                                mock_col.return_value = mock_collection
                                
                                for query in queries:
                                    response = test_client.post(
                                        "/api/search",
                                        json={"query": query}
                                    )
                                    assert response.status_code in [200, 400, 422]
    
    @pytest.mark.unit
    def test_search_whitespace_only(self, test_client: TestClient):
        """Test search with whitespace-only query."""
        response = test_client.post(
            "/api/search",
            json={"query": "   \t\n   "}
        )
        assert response.status_code == 400
