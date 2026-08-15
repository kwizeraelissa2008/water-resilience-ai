# Water Resilience AI

(use your own ai and apis for ai  and real weather) WaterIO — Full Functional AI Water Resilience Platform

Build WaterIO, a production-quality, AI-powered web application that helps households and communities manage water more intelligently in a changing climate.

This is for the Oxford Saïd Global Climate Tech Challenge 2026, so the product must feel like a serious climate-tech solution rather than a generic SaaS dashboard.

CORE IDEA

WaterIO uses real weather/climate data, real user data, calculations, and real AI to answer:

How can we conserve water, prepare for droughts and floods, and make better use of rainwater?

WaterIO should help users understand their current water situation, plan how to use and store water, and receive early warnings about climate-related water risks.

Tagline

WaterIO — Smart Water. Secure Future.

Main value proposition

AI-powered water intelligence for a water-secure and climate-resilient future.

IMPORTANT — NO MOCKS

This must be a fully functional application.

DO NOT create fake/mock data for the actual application functionality.

Do not create fake API responses.

Do not create fake AI responses.

Do not create buttons that do nothing.

Do not create pages that are only visual prototypes.

Every major button, form, navigation item, calculation, AI interaction, authentication flow, and API-dependent feature must actually work.

Where an external API requires an API key, implement the integration correctly and use environment variables.

Create a clear .env.example showing every required environment variable.

If an API temporarily fails, show a graceful error state rather than replacing it with fake data.

TECHNOLOGY

Use a modern production-ready stack:

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Lucide React icons

Supabase

Authentication

PostgreSQL database

Row Level Security

Supabase Edge Functions for secure server-side operations

OpenAI API for the AI functionality

Open-Meteo for real weather/forecast data where possible

OpenStreetMap/Nominatim or another appropriate geocoding service for location search

Recharts for data visualization

Never expose private API keys in frontend code.

AI API calls must happen securely through a backend/Edge Function.

DESIGN DIRECTION

The UI should be significantly better than a normal student project.

Think:

Oxford climate-tech + premium modern SaaS + trustworthy environmental technology.

The design should communicate:

Trust

Climate resilience

Intelligence

Clean water

Sustainability

Professionalism

Hope

Real-world impact

Use a sophisticated palette based around:

Deep navy

Water blue

Cyan

Fresh green

White

Very light blue/gray backgrounds

Use subtle gradients, glass-like elements only where appropriate, rounded cards, beautiful typography, soft shadows, excellent spacing, and strong visual hierarchy.

Do NOT make the UI overly futuristic or cyberpunk.

It should look like a serious climate technology product that could realistically be used by communities, households, NGOs, schools, and local governments.

BRAND

Product name:

WaterIO

Logo concept:

A modern water droplet combined with a subtle circular/data/AI element.

Logo text:

WaterIO

Small descriptor:

Smart Water. Secure Future.

Use the same branding consistently throughout the entire application.

ONLY 3 MAIN FEATURES

WaterIO must focus on exactly these three flagship features.

01 — Rainwater Planner

Help users understand how much rainwater they can potentially collect and how they should prepare their storage.

The user should be able to enter:

Location

Roof area

Roof type/material

Collection efficiency

Current tank capacity

Current stored water

Use REAL rainfall/weather forecast data.

Calculate:

Expected rainfall

Estimated harvestable rainwater

Expected collection over different periods

Recommended storage capacity

Current storage utilization

Potential water savings

Use the formula:

Harvested Water = Rainfall × Roof Area × Runoff/Catchment Efficiency

Clearly explain calculations.

Show beautiful visualizations.

Example:

Expected rainfall

18 mm

Potential harvest

12,450 L

Recommended storage

15,000 L

But these values must be dynamically calculated from actual user inputs and real weather data.

Include:

Plan My Harvest

When clicked, generate the user's personalized rainwater plan.

The AI can explain:

when rainfall is expected

how much water could potentially be collected

whether current storage is sufficient

how to prepare for rainfall

how to prioritize stored water

02 — AI Water Management Plan

This is the main AI feature.

Users provide:

Number of people

Available water

Average daily consumption

Household/community type

Storage capacity

Location

Optional water-use categories

Optional emergency reserve target

Use real weather information for their location.

The AI should analyze:

Current available water

Estimated consumption

Forecast rainfall

Temperature

Upcoming dry/wet conditions

User's available storage

Water demand

Then produce a personalized water management plan.

Example:

AI Water Assessment

Water security: 78/100

Estimated supply duration: 11 days

Today's AI recommendations

✓ Reduce non-essential water use by 12%

✓ Delay unnecessary water-intensive activities

✓ Maintain an emergency reserve

✓ Prepare storage before expected rainfall

AI explanation

Use the OpenAI API to generate an intelligent explanation based on the actual structured data.

The AI must NOT invent weather information.

Give the AI structured real data from the weather API and user database.

AI CHAT

Include an AI assistant inside the Water Management feature.

Name:

WaterIO AI

Users can ask questions such as:

“Will I have enough water for the next two weeks?”

“How much rainwater could I collect this month?”

“What should I do if rainfall decreases?”

“How can my family reduce water consumption?”

“How should I prepare for a possible flood?”

“What does my water security score mean?”

The AI should answer using the user's actual WaterIO data and real weather information.

Add conversation history to the database.

The AI must clearly distinguish between:

Real measured/API data

Calculated estimates

AI recommendations

Do not allow the AI to present uncertain predictions as guaranteed facts.

03 — Climate & Water Risk Alerts

This feature should provide real early-warning information.

Use real weather forecast data.

Analyze conditions relevant to:

Heavy rainfall

Flood risk

Extended low rainfall

Drought/water stress

Extreme temperatures

Create a simple risk engine.

For example:

Flood Risk

Analyze forecast precipitation and consecutive rainfall conditions.

Dry/Drought Risk

Analyze low rainfall periods, forecast conditions, and temperature.

Do not claim that this is an official emergency warning system.

Clearly label it:

WaterIO Climate Risk Estimate

and explain that it is an informational early-warning tool based on available forecast data.

Show:

🟢 Low

🟡 Moderate

🟠 High

🔴 Severe

Each alert should include:

Risk level

Location

Expected time period

Why the risk was detected

Recommended preparation actions

Data timestamp

Example:

🔴 High Flood Risk

Kigali, Rwanda

Heavy rainfall is forecast during the next 24–48 hours.

WaterIO recommends:

Protect stored drinking water

Check drainage around your property

Avoid unnecessary exposure to flood-prone areas

Monitor official local emergency guidance

Always prioritize official emergency authorities for actual emergency decisions.

LANDING PAGE

Create a beautiful marketing landing page.

Hero

Large headline:

AI for Water. Water for Life.

Subheadline:

WaterIO helps households and communities predict water risks, plan rainwater collection, and make smarter decisions with AI.

Primary CTA:

Get Started

Secondary CTA:

See How It Works

Hero visual should show a premium WaterIO dashboard/product interface with water/climate imagery.

Use a real high-quality environmental image, not a generated fake chart.

Landing Page Sections

Hero

AI-powered water resilience.

The Problem

Climate change is making water less predictable.

Show:

Drought

Floods

Water scarcity

Inefficient water use

The Solution

Introduce the three WaterIO features.

Use exactly:

01 Rainwater Planner

02 AI Water Management

03 Climate & Water Risk Alerts

How WaterIO Works

Connect your location

WaterIO analyzes real climate/weather data

AI turns the data into practical decisions

Impact

Show dynamic/product-focused impact concepts such as:

Water saved

Rainwater planned

Risk alerts generated

Communities supported

Do not fabricate real-world impact numbers.

For a new user, show clearly labeled product metrics or empty states instead of pretending WaterIO has already saved millions of liters.

Why WaterIO

Data-driven

AI-powered

Climate-aware

Accessible

Designed for communities

Scalable

CTA

Start securing your water future.

LOGIN

Create a beautiful login page.

Support:

Email/password

Google authentication if Supabase configuration supports it

Include:

Forgot password

Remember session

Error states

Loading states

Password visibility toggle

Link to signup

Authentication must actually work through Supabase.

SIGNUP

Create a polished signup page.

Fields:

Full name

Email

Password

Confirm password

Include:

Password strength indicator

Terms acceptance

Validation

Real Supabase account creation

Email verification flow where enabled

Proper error handling

ONBOARDING

After signup, guide the user through a short onboarding experience.

Step 1 — Location

Ask:

Where are you located?

Allow:

Search location

Browser location permission if available

Use real geocoding.

Save:

City

Country

Latitude

Longitude

Timezone where available

Step 2 — Water Profile

Ask:

Tell us about your water situation.

Fields:

Household/community

Number of people

Current available water

Storage capacity

Approximate daily consumption

Step 3 — Rainwater

Ask:

Do you collect rainwater?

Options:

Yes

No

Planning to

If yes:

Roof area

Tank capacity

Step 4 — Goals

Allow the user to select goals:

Conserve water

Prepare for drought

Prepare for floods

Improve rainwater collection

Understand my water situation

Then create their profile.

DASHBOARD

The dashboard should match the previously designed WaterIO concept.

Layout:

Left sidebar

WaterIO logo

Home

Dashboard

Rainwater Planner

AI Water Plan

Climate & Water Alerts

Reports

Profile

Settings

Do NOT add unnecessary product features.

The three main features must remain visually dominant.

Dashboard Header

Show:

User greeting

Location

Current weather

Temperature

Notification icon

Profile

Weather must come from a real API.

DASHBOARD HERO

Display:

Welcome to WaterIO

AI-powered solutions for a water-secure and climate-resilient future.

Show a beautiful water/environment visual.

Include:

Water Security Score

Calculate this dynamically from the user's actual data.

Do not hard-code a fake score.

Explain the score with an info tooltip.

THREE FEATURE CARDS

Create three large premium cards.

01

💧 Rainwater Planner

Plan how much rainwater you can collect and how much storage you need.

Button:

Plan My Harvest

02

🤖 AI Water Management

Let AI analyze your water situation and create a personalized conservation plan.

Button:

Create My Plan

03

🌍 Climate & Water Risk Alerts

Understand upcoming water-related climate risks in your location.

Button:

View Risk Alerts

REAL WEATHER DATA

Use a real weather API.

Prefer Open-Meteo where its available endpoints provide the necessary data without requiring a paid API key.

Retrieve:

Current temperature

Precipitation

Precipitation probability

Weather condition

Daily rainfall

Forecast

Wind where useful

Use the user's actual latitude/longitude.

Show:

Last updated: [actual timestamp]

Do not display fake weather.

If weather data cannot be loaded:

Weather data unavailable. Please try again.

Never replace it with fake weather.

DATABASE

Use Supabase PostgreSQL.

Create appropriate tables such as:

profiles

id

full_name

location

country

latitude

longitude

timezone

created_at

water_profiles

id

user_id

household_size

available_water_liters

storage_capacity_liters

daily_consumption_liters

roof_area_m2

tank_capacity_liters

rainwater_collection_enabled

created_at

updated_at

water_plans

id

user_id

plan_data

ai_summary

water_security_score

created_at

rainwater_plans

id

user_id

rainfall_data

roof_area

estimated_harvest

recommended_storage

created_at

risk_alerts

id

user_id

location

risk_type

severity

forecast_data

explanation

recommendations

created_at

ai_conversations

id

user_id

created_at

ai_messages

id

conversation_id

role

content

created_at

Use Supabase Row Level Security so users can only access their own private information.

SECURITY

Never expose:

OpenAI secret key

Supabase service role key

Any private credentials

Frontend should only use public Supabase configuration.

Sensitive AI operations should go through Supabase Edge Functions.

Validate all user input.

Add rate limiting or reasonable abuse protection to AI endpoints where practical.

AI ARCHITECTURE

Create an Edge Function such as:

water-ai

The frontend sends structured information:

user profile
+
water profile
+
current weather
+
forecast
+
calculated water statistics


The Edge Function sends the structured context to OpenAI.

The AI returns structured recommendations.

Prefer structured JSON output so the frontend can reliably render:

Summary

Water security assessment

Risks

Recommendations

Explanation

Confidence/uncertainty notes

Never allow the AI to fabricate weather or numerical measurements.

CALCULATIONS

Implement real calculations in TypeScript/server-side functions.

Water duration

available water / daily consumption

Rainwater harvesting

rainfall_mm × roof_area_m2 × efficiency

Remember that:

1 mm of rain over 1 m² = approximately 1 liter of water.

Storage utilization

current_water / storage_capacity × 100

Water balance

Calculate:

incoming water - expected consumption

over the selected forecast period.

Make calculations transparent to users.

REPORTS

Create a working Reports page.

Users should be able to see:

Water usage

Historical water data entered by the user.

Rainwater potential

Historical calculations.

Risk history

Previous WaterIO risk assessments.

AI recommendations

Previous water plans.

Use charts where real user data exists.

If there isn't enough historical data, show a beautiful empty state:

Your WaterIO history is still growing.

Do not invent historical data.

PROFILE

Allow users to edit:

Name

Location

Household size

Water availability

Storage

Roof information

Preferences

Changes must persist to Supabase.

SETTINGS

Include:

Account

Notifications

Location

Data/privacy

AI preferences

Sign out

All relevant settings should actually work.

RESPONSIVE DESIGN

The entire application must work beautifully on:

Desktop

Laptop

Tablet

Mobile

The mobile dashboard should become a proper mobile app-like interface.

Do not simply shrink the desktop layout.

Use responsive navigation and mobile-friendly cards.

REAL IMAGES

Use beautiful, high-quality real environmental photography where appropriate.

For example:

Landing page

Real image of:

clean water

rainwater

African landscape

community water resilience

Rainwater Planner

Real photograph of rainwater harvesting/storage.

Climate Risk

Real photograph showing rainfall/flooding or climate conditions.

Do not use obviously artificial-looking images.

Use legally usable image sources such as Unsplash or another appropriate image service.

Do not rely on images from the original UI mockup.

Optimize image sizes and loading.

Use meaningful alt text.

ACCESSIBILITY

Make the app accessible.

Include:

Proper contrast

Keyboard navigation

Labels

Accessible buttons

ARIA where appropriate

Screen-reader-friendly forms

Do not rely on color alone for risk levels

UX DETAILS

Every async operation needs:

Loading state

Success state

Error state

Every form needs:

Validation

Helpful error messages

Disabled submit while processing

For API failures:

We couldn't retrieve the latest weather data. Please try again.

For AI failures:

WaterIO AI is temporarily unavailable. Your saved data is safe. Please try again.

Never silently fail.

EMPTY STATES

Design beautiful empty states instead of fake content.

Example:

No water plan yet

Tell WaterIO about your water situation and we'll create your first AI-powered plan.

Button:

Create Water Plan

NOTIFICATIONS

Create a notification system for:

New climate risk

Updated weather forecast

AI recommendation

Water plan update

Notifications should be based on actual data.

Do not generate fake notifications simply to fill the interface.

DEMO EXPERIENCE

Make the first-time user experience extremely impressive.

After onboarding:

Fetch real weather data.

Calculate their water situation.

Calculate rainwater potential.

Generate their first WaterIO AI assessment.

Show relevant climate risks.

Populate the dashboard dynamically.

The user should immediately understand:

“This app knows my location, understands my water situation, analyzes real weather data, and gives me useful actions.”

PROFESSIONAL POLISH

Add:

Smooth but subtle animations

Skeleton loaders

Toast notifications

Tooltips

Confirmation dialogs

Beautiful charts

Consistent icons

Excellent typography

Responsive interactions

Error boundaries

Proper routing

SEO metadata

Favicon

WaterIO branding

Avoid excessive animations.

Performance matters.

ROUTES

Create real routes:

/

/login

/signup

/onboarding

/dashboard

/rainwater

/water-plan

/climate-risks

/reports

/profile

/settings

Protect authenticated routes.

Unauthenticated users should be redirected to login.

Users who haven't completed onboarding should be redirected to onboarding.

FINAL QUALITY STANDARD

Before considering the application complete, test every flow.

Authentication

Signup works

Login works

Logout works

Password reset works

Protected routes work

Onboarding

Location works

Geocoding works

User data saves

Onboarding completion persists

Weather

Real API request works

Current weather works

Forecast works

Error handling works

Rainwater

User input works

Calculations are real

Forecast data is real

Results update dynamically

Plan saves

AI

AI request reaches backend securely

OpenAI response works

AI uses actual user data

AI uses real weather context

Conversation history saves

Errors are handled

Climate Risks

Real forecast is analyzed

Risk calculation works

Alerts update with forecast data

Recommendations are displayed

Database

Data persists after refresh

Users only see their own data

RLS is enabled

UI

No broken links

No dead buttons

No fake statistics

No placeholder lorem ipsum

No mock API responses

No hard-coded weather

No fake AI responses

No unfinished pages

IMPORTANT PRODUCT PRINCIPLE

WaterIO is NOT simply a weather application.

WaterIO is NOT simply a chatbot.

WaterIO is NOT simply a rainwater calculator.

It is an:

AI WATER RESILIENCE PLATFORM

The intelligence layer should connect:

Real climate data + personal water data + transparent calculations + AI reasoning → practical water decisions.

The product should make a judge immediately understand:

WaterIO helps people prepare BEFORE water scarcity or climate risk becomes a crisis.

Build the application completely, connect all real services, create the database, authentication, Edge Functions, API integrations, AI functionality, responsive UI, error handling, and all pages.

Do not stop at a frontend prototype.

Build the actual working WaterIO product.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4147fd38-da08-4242-b1e1-f795cdeb43d3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
