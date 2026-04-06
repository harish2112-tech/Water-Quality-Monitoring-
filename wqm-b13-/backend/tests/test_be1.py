from main import app

def test_routes_registered():
    routes = [route.path for route in app.routes]
    
    # Check for new BE-1 endpoints
    assert "/api/v1/collaborations" in routes
    assert "/api/reports/{report_id}/status" in routes
    assert "/stations/readings/aggregate" in routes
    assert "/users" in routes
    
    print("All required BE-1 routes are registered!")

if __name__ == "__main__":
    test_routes_registered()
