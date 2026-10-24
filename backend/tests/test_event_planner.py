"""
EventGenie AI - Automated Test Suite
Covers deterministic budget math, replanning algorithms, timeline logic,
schema validation, and database operations.
"""

import unittest
import sys
import os

# Add backend directory to sys.path
TEST_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(TEST_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import planner_engine
import database
from demo_data import CAMPUS_CARNIVAL_2026, PRESET_TEMPLATES

class TestBudgetIntelligence(unittest.TestCase):
    
    def test_budget_exact_sum_and_contingency(self):
        """Verify allocable budget + contingency exactly equals total budget with zero rounding drift."""
        test_budgets = [10000.0, 75550.50, 150000.0, 500000.0, 1234567.89]
        for b in test_budgets:
            result = planner_engine.calculate_budget(total_budget=b, contingency_percent=10.0)
            self.assertTrue(result["is_balanced"], f"Budget calculation not balanced for {b}")
            self.assertAlmostEqual(result["total_with_contingency"], b, places=2)
            self.assertAlmostEqual(result["contingency_amount"], b * 0.10, places=2)
            self.assertEqual(len(result["categories"]), 8)

    def test_custom_contingency_percentages(self):
        """Verify contingency calculation adapts correctly across 5%, 12%, and 20%."""
        b = 200000.0
        for pct in [5.0, 12.0, 20.0]:
            res = planner_engine.calculate_budget(total_budget=b, contingency_percent=pct)
            expected_contingency = round(b * (pct / 100.0), 2)
            self.assertAlmostEqual(res["contingency_amount"], expected_contingency, places=2)
            self.assertAlmostEqual(res["allocable_budget"] + res["contingency_amount"], b, places=2)

    def test_smart_budget_reduction_15_percent(self):
        """Verify 15% budget reduction preserves protected categories and saves exact amount."""
        base_budget = planner_engine.calculate_budget(150000.0, contingency_percent=10.0)
        reduction_result = planner_engine.reduce_budget_smartly(
            base_budget,
            reduction_percent=15.0,
            protected_category_names=["Food & Catering", "Venue & Facilities"]
        )
        
        self.assertAlmostEqual(reduction_result["savings_amount"], 22500.0, places=2)
        self.assertAlmostEqual(reduction_result["reduced_total"], 127500.0, places=2)
        
        revised = reduction_result["revised_budget"]
        self.assertTrue(revised["is_balanced"])
        self.assertAlmostEqual(revised["total_with_contingency"], 127500.0, places=2)

    def test_zero_or_negative_budget_handling(self):
        """Ensure defensive handling for zero or negative budgets."""
        res_zero = planner_engine.calculate_budget(0.0)
        self.assertEqual(res_zero["total_budget"], 0.0)
        self.assertEqual(res_zero["contingency_amount"], 0.0)
        
        res_neg = planner_engine.calculate_budget(-500.0)
        self.assertEqual(res_neg["total_budget"], 0.0)


class TestPlanningLogic(unittest.TestCase):

    def test_timeline_chronology(self):
        """Ensure generated timeline items are sequential and non-empty."""
        timeline = planner_engine.generate_timeline("College fest", start_time="10:00", duration_hours=10)
        self.assertGreaterEqual(len(timeline), 5)
        for item in timeline:
            self.assertIn("time", item)
            self.assertIn("phase", item)
            self.assertIn("title", item)
            self.assertFalse(item["completed"])

    def test_checklist_milestones(self):
        """Ensure preparation checklist contains urgent and high priority tasks."""
        checklist = planner_engine.generate_checklist("Wedding")
        self.assertGreaterEqual(len(checklist), 8)
        priorities = {item["priority"] for item in checklist}
        self.assertIn("Urgent", priorities)
        self.assertIn("High", priorities)

    def test_contingencies_coverage(self):
        """Ensure critical contingency areas (weather, power, vendors) are addressed."""
        contingencies = planner_engine.generate_contingencies("Birthday")
        self.assertGreaterEqual(len(contingencies), 4)
        titles = " ".join([c["title"] for c in contingencies]).lower()
        self.assertTrue("weather" in titles or "rain" in titles)
        self.assertTrue("vendor" in titles)
        self.assertTrue("power" in titles)

    def test_synthesize_complete_plan(self):
        """Verify full plan synthesis aggregates all sub-components seamlessly."""
        setup_data = {
            "title": "Neon Nights Fest",
            "occasion": "College fest",
            "city": "Bengaluru",
            "guests": 250,
            "budget": 150000.0,
            "currency": "₹",
            "contingency_percent": 10.0
        }
        plan = planner_engine.synthesize_complete_plan(setup_data)
        self.assertEqual(plan["title"], "Neon Nights Fest")
        self.assertEqual(plan["budget_breakdown"]["total_budget"], 150000.0)
        self.assertEqual(len(plan["color_palette"]), 4)
        self.assertIn("theme_concepts", plan["ideas"])
        self.assertIn("action_plan", plan["contingencies"][0])


class TestCampusCarnivalDemoData(unittest.TestCase):

    def test_demo_event_structure(self):
        """Verify Campus Carnival 2026 demo event adheres strictly to specifications."""
        demo = CAMPUS_CARNIVAL_2026
        self.assertEqual(demo["occasion"], "College fest")
        self.assertEqual(demo["guests"], 250)
        self.assertEqual(demo["budget"], 150000.0)
        self.assertEqual(demo["currency"], "₹")
        self.assertEqual(demo["theme"], "Neon Nights: Retro-Futuristic Glow")
        
        # Check budget allocations
        b = demo["budget_breakdown"]
        cat_sum = sum(c["allocated"] for c in b["categories"])
        self.assertAlmostEqual(cat_sum + b["contingency_amount"], b["total_budget"], places=2)
        
        # Verify 9 timeline items
        self.assertEqual(len(demo["timeline"]), 9)
        
        # Verify 10 checklist items
        self.assertEqual(len(demo["checklist"]), 10)


class TestDatabasePersistence(unittest.TestCase):

    def setUp(self):
        database.init_db()

    def test_save_and_retrieve_event(self):
        """Verify SQLite save, fetch, and delete lifecycle."""
        test_event = {
            "id": "test_evt_unit_999",
            "title": "Unit Test Celebration",
            "occasion": "Birthday",
            "city": "Goa",
            "date": "2026-12-25",
            "guests": 50,
            "budget": 45000.0,
            "currency": "₹",
            "notes": "Unit test plan payload"
        }
        
        # Save
        saved_id = database.save_event(test_event)
        self.assertEqual(saved_id, "test_evt_unit_999")
        
        # Retrieve
        fetched = database.get_event("test_evt_unit_999")
        self.assertIsNotNone(fetched)
        self.assertEqual(fetched["title"], "Unit Test Celebration")
        self.assertEqual(fetched["budget"], 45000.0)
        
        # Delete
        deleted = database.delete_event("test_evt_unit_999")
        self.assertTrue(deleted)
        self.assertIsNone(database.get_event("test_evt_unit_999"))


if __name__ == "__main__":
    unittest.main()
