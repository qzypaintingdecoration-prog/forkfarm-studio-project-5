import os
import urllib.request
import time

# Create directories
directories = [
    '/public/images/services',
    '/public/images/social/posts',
    '/public/images/social/stories',
    '/public/images/calculators',
    '/public/images/knowledge',
    '/public/images/observatory',
    '/public/images/contact',
    '/public/images/briefing'
]

for d in directories:
    full_path = '/app/applet' + d
    os.makedirs(full_path, exist_ok=True)

# Curated high-resolution Unsplash photo IDs for culinary & hospitality
ASSETS = {
    # 1. Services (10 photos)
    '/public/images/services/01_bespoke_web.jpg': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
    '/public/images/services/02_web_management.jpg': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85',
    '/public/images/services/03_digital_qr_menu.jpg': 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=85',
    '/public/images/services/04_luxury_print_menus.jpg': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
    '/public/images/services/05_food_ordering_apps.jpg': 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=85',
    '/public/images/services/06_social_studio.jpg': 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1200&q=85',
    '/public/images/services/07_free_guidance.jpg': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85',
    '/public/images/services/08_kitchen_display.jpg': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85',
    '/public/images/services/09_allergen_compliance.jpg': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=85',
    '/public/images/services/10_continuous_support.jpg': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=85',

    # 2A. Social Studio 1:1 Post Presets (10 photos, square crop)
    '/public/images/social/posts/post_01_wagyu_burger.jpg': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&h=1000&q=85',
    '/public/images/social/posts/post_02_artisan_pizza.jpg': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&h=1000&q=85',
    '/public/images/social/posts/post_03_omakase_nigiri.jpg': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&h=1000&q=85',
    '/public/images/social/posts/post_04_truffle_pasta.jpg': 'https://images.unsplash.com/photo-1621996346565-e3d5d628120e?auto=format&fit=crop&w=1000&h=1000&q=85',
    '/public/images/social/posts/post_05_weekend_brunch.jpg': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&h=1000&q=85',
    '/public/images/social/posts/post_06_golden_cocktail.jpg': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&h=1000&q=85',
    '/public/images/social/posts/post_07_sunday_roast.jpg': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&h=1000&q=85',
    '/public/images/social/posts/post_08_artisan_dessert.jpg': 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1000&h=1000&q=85',
    '/public/images/social/posts/post_09_secret_tasting.jpg': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&h=1000&q=85',
    '/public/images/social/posts/post_10_cellar_wine.jpg': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&h=1000&q=85',

    # 2B. Social Studio 9:16 Story Presets (10 photos, vertical crop)
    '/public/images/social/stories/story_01_wagyu_burger.jpg': 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1080&h=1920&q=85',
    '/public/images/social/stories/story_02_artisan_pizza.jpg': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1080&h=1920&q=85',
    '/public/images/social/stories/story_03_omakase_nigiri.jpg': 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1080&h=1920&q=85',
    '/public/images/social/stories/story_04_truffle_pasta.jpg': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1080&h=1920&q=85',
    '/public/images/social/stories/story_05_weekend_brunch.jpg': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1080&h=1920&q=85',
    '/public/images/social/stories/story_06_golden_cocktail.jpg': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1080&h=1920&q=85',
    '/public/images/social/stories/story_07_sunday_roast.jpg': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1080&h=1920&q=85',
    '/public/images/social/stories/story_08_artisan_dessert.jpg': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1080&h=1920&q=85',
    '/public/images/social/stories/story_09_secret_tasting.jpg': 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1080&h=1920&q=85',
    '/public/images/social/stories/story_10_cellar_wine.jpg': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1080&h=1920&q=85',

    # 3. Project Calculator — Mathematical Models (10 photos)
    '/public/images/calculators/01_food_cost_formula.jpg': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=85',
    '/public/images/calculators/02_menu_pricing_ladder.jpg': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85',
    '/public/images/calculators/03_promotional_simulator.jpg': 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=85',
    '/public/images/calculators/04_yield_and_waste.jpg': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1000&q=85',
    '/public/images/calculators/05_batch_to_portion.jpg': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85',
    '/public/images/calculators/06_vat_and_tax.jpg': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=85',
    '/public/images/calculators/07_prep_labour_cost.jpg': 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=85',
    '/public/images/calculators/08_aggregator_drag.jpg': 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1000&q=85',
    '/public/images/calculators/09_seasonal_hedging.jpg': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1000&q=85',
    '/public/images/calculators/10_prime_cost_matrix.jpg': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=85',

    # 4. Insights / Knowledge Archive (10 photos)
    '/public/images/knowledge/01_digital_menu_psychology.jpg': 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85',
    '/public/images/knowledge/02_high_converting_restaurant_web.jpg': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=85',
    '/public/images/knowledge/03_local_seo_google_maps.jpg': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
    '/public/images/knowledge/04_high_frequency_social_strategy.jpg': 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1200&q=85',
    '/public/images/knowledge/05_inflation_prime_margin_protection.jpg': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85',
    '/public/images/knowledge/06_zero_commission_ordering_economics.jpg': 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=85',
    '/public/images/knowledge/07_sommelier_wine_list_architecture.jpg': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85',
    '/public/images/knowledge/08_back_of_house_kds_routing.jpg': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=85',
    '/public/images/knowledge/09_allergen_compliance_natashas_law.jpg': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=85',
    '/public/images/knowledge/10_table_turn_rate_analytics.jpg': 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=85',

    # 5. Studio Observatory — Visual Philosophy Deck (10 photos)
    '/public/images/observatory/01_founding_philosophy_monolith.jpg': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    '/public/images/observatory/02_food_and_beverage_specialization.jpg': 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=85',
    '/public/images/observatory/03_spatial_and_sensory_design.jpg': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85',
    '/public/images/observatory/04_unit_economics_first.jpg': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=85',
    '/public/images/observatory/05_zero_bloat_code_architecture.jpg': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=85',
    '/public/images/observatory/06_direct_restaurateur_relationship.jpg': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85',
    '/public/images/observatory/07_uk_hospitality_standards.jpg': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85',
    '/public/images/observatory/08_sustainable_digital_infrastructure.jpg': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=85',
    '/public/images/observatory/09_bespoke_vs_template_analysis.jpg': 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=85',
    '/public/images/observatory/10_long_term_operational_partnership.jpg': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=85',

    # 6. Contact — SLA Commitments (10 photos)
    '/public/images/contact/01_direct_inbox_concierge.jpg': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85',
    '/public/images/contact/02_confidential_nda_protection.jpg': 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=85',
    '/public/images/contact/03_same_day_response_sla.jpg': 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1200&q=85',
    '/public/images/contact/04_london_studio_presence.jpg': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85',
    '/public/images/contact/05_video_conference_terminal.jpg': 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1200&q=85',
    '/public/images/contact/06_instant_quote_estimator.jpg': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=85',
    '/public/images/contact/07_emergency_menu_hotline.jpg': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=85',
    '/public/images/contact/08_client_onboarding_handshake.jpg': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85',
    '/public/images/contact/09_post_briefing_roadmap.jpg': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=85',
    '/public/images/contact/10_trade_partnership_inquiries.jpg': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=85',

    # 7. Briefing Chamber — 10-Stage Roadmap (10 photos)
    '/public/images/briefing/01_discovery_call_architecture.jpg': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=85',
    '/public/images/briefing/02_venue_dna_questionnaire.jpg': 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=85',
    '/public/images/briefing/03_pos_integration_scoping.jpg': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=85',
    '/public/images/briefing/04_budget_tier_estimation.jpg': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=85',
    '/public/images/briefing/05_project_milestone_timeline.jpg': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1000&q=85',
    '/public/images/briefing/06_creative_deliverables_manifest.jpg': 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1000&q=85',
    '/public/images/briefing/07_rapid_prototyping_sprint.jpg': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85',
    '/public/images/briefing/08_qa_and_device_testing.jpg': 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1000&q=85',
    '/public/images/briefing/09_launch_day_go_live.jpg': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85',
    '/public/images/briefing/10_post_launch_support_sla.jpg': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=85'
}

req_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

success_count = 0
total_count = len(ASSETS)

for rel_path, url in ASSETS.items():
    dest_path = '/app/applet' + rel_path
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 10000:
        success_count += 1
        continue
    try:
        req = urllib.request.Request(url, headers=req_headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = response.read()
            if len(data) > 5000:
                with open(dest_path, 'wb') as f:
                    f.write(data)
                success_count += 1
                print(f"Downloaded [{success_count}/{total_count}]: {rel_path} ({len(data)} bytes)")
            else:
                print(f"Warning: small file for {rel_path}: {len(data)} bytes")
    except Exception as e:
        print(f"Error downloading {rel_path}: {e}")
    time.sleep(0.05)

print(f"Complete: {success_count}/{total_count} downloaded successfully.")
