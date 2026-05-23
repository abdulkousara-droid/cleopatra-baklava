<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $template = <<<'HTML'
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Welcome to Cleopatra Baklava</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Inter', Arial, sans-serif;
            background-color: #f7f3ec;
            color: #1e1b14;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
        }

        .email-wrapper {
            max-width: 620px;
            margin: 40px auto;
            background-color: #fffdf8;
            border: 1px solid #e8dfc8;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 4px 30px rgba(30,27,20,0.08);
        }

        .email-header {
            background-color: #1e1b14;
            padding: 48px 48px 36px;
            text-align: center;
            position: relative;
        }

        .email-header::after {
            content: '';
            display: block;
            height: 3px;
            background: linear-gradient(90deg, transparent, #c9a84c, #e8c96e, #c9a84c, transparent);
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }

        .header-ornament {
            display: block;
            text-align: center;
            color: #c9a84c;
            letter-spacing: 6px;
            font-size: 11px;
            text-transform: uppercase;
            font-family: 'Inter', sans-serif;
            font-weight: 400;
            margin-bottom: 20px;
            opacity: 0.7;
        }

        .brand-name {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 38px;
            font-weight: 600;
            color: #c9a84c;
            letter-spacing: 2px;
            line-height: 1.1;
            display: block;
        }

        .brand-tagline {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 14px;
            color: #9e8b6e;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-top: 8px;
            font-style: italic;
            display: block;
        }

        .geometric-divider {
            text-align: center;
            padding: 24px 0 8px;
            color: #c9a84c;
            font-size: 22px;
            letter-spacing: 12px;
            opacity: 0.6;
        }

        .email-body {
            padding: 48px 48px 32px;
        }

        .welcome-label {
            display: block;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #c9a84c;
            margin-bottom: 16px;
        }

        .welcome-heading {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 32px;
            font-weight: 600;
            color: #1e1b14;
            line-height: 1.2;
            margin-bottom: 24px;
        }

        .welcome-heading em {
            color: #c9a84c;
            font-style: italic;
        }

        .welcome-text {
            font-size: 15px;
            color: #4d4637;
            line-height: 1.8;
            margin-bottom: 16px;
        }

        .section-label {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 5px;
            text-transform: uppercase;
            color: #c9a84c;
            margin-bottom: 20px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e8dfc8;
            display: block;
        }

        .feature-row {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }

        .feature-icon {
            width: 48px;
            height: 48px;
            background: #faf5ec;
            border: 1px solid #e8dfc8;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            font-size: 20px;
            line-height: 1;
        }

        .feature-text h4 {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 17px;
            font-weight: 600;
            color: #1e1b14;
            margin-bottom: 4px;
        }

        .feature-text p {
            font-size: 13px;
            color: #6b5e47;
            line-height: 1.6;
        }

        .cta-wrapper {
            text-align: center;
            padding: 36px 0 12px;
        }

        .cta-button {
            display: inline-block;
            background-color: #c9a84c;
            color: #1e1b14 !important;
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            text-decoration: none;
            padding: 18px 52px;
            border-radius: 2px;
        }

        .email-footer {
            background-color: #1e1b14;
            padding: 36px 48px;
            text-align: center;
        }

        .footer-brand {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 20px;
            color: #c9a84c;
            letter-spacing: 2px;
            margin-bottom: 12px;
        }

        .footer-address {
            font-size: 12px;
            color: #6b5e47;
            line-height: 1.8;
            margin-bottom: 20px;
        }

        .footer-links {
            margin-bottom: 20px;
        }

        .footer-links a {
            font-size: 11px;
            color: #9e8b6e;
            text-decoration: none;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin: 0 12px;
        }

        .footer-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #3a3428, transparent);
            margin: 20px 0;
        }

        .footer-unsubscribe {
            font-size: 11px;
            color: #4d4637;
            line-height: 1.8;
        }

        .footer-unsubscribe a {
            color: #6b5e47;
            text-decoration: underline;
        }

        @media only screen and (max-width: 600px) {
            .email-wrapper { margin: 0; border-radius: 0; }
            .email-header, .email-body, .email-footer { padding: 32px 24px; }
            .brand-name { font-size: 30px; }
            .welcome-heading { font-size: 26px; }
            .feature-row { flex-direction: column; }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">

        <!-- HEADER -->
        <div class="email-header">
            <span class="header-ornament">✦ Est. Barcelona, 2008 ✦</span>
            <span class="brand-name">Cleopatra Baklava</span>
            <span class="brand-tagline">Artisanal Mediterranean Confections</span>
        </div>

        <!-- BODY -->
        <div class="email-body">
            <div class="geometric-divider">◆ &nbsp; ◆ &nbsp; ◆</div>

            <span class="welcome-label">✦ &nbsp; You're In</span>
            <h1 class="welcome-heading">
                Welcome to the<br />
                <em>Inner Circle.</em>
            </h1>

            <p class="welcome-text">
                Dear Connoisseur,
            </p>
            <p class="welcome-text">
                We are delighted to welcome you into the heart of Cleopatra Baklava — where
                centuries-old recipes meet European artistry. From the pistachio-laden valleys
                of Gaziantep to the sun-drenched workshops of Barcelona, every piece we craft
                is a quiet act of devotion.
            </p>
            <p class="welcome-text">
                As a treasured member of our Inner Circle, you will be the first to receive
                exclusive invitations, seasonal collection reveals, and tastings.
            </p>

            <!-- FEATURES -->
            <span class="section-label">Why Cleopatra Baklava</span>

            <div class="feature-row">
                <div class="feature-icon">🌿</div>
                <div class="feature-text">
                    <h4>All-Natural Ingredients</h4>
                    <p>We source only organic wildflower honey, first-harvest Gaziantep pistachios, and pure cultured butter — never shortcuts.</p>
                </div>
            </div>

            <div class="feature-row">
                <div class="feature-icon">🏛️</div>
                <div class="feature-text">
                    <h4>Ancient Techniques</h4>
                    <p>Our master pastry chefs hand-roll each layer of phyllo to translucent perfection — a tradition unchanged for four centuries.</p>
                </div>
            </div>

            <div class="feature-row">
                <div class="feature-icon">📦</div>
                <div class="feature-text">
                    <h4>Express Delivery</h4>
                    <p>Same-day delivery available in Barcelona. Every order ships in our signature collector's gift box, ready to impress.</p>
                </div>
            </div>

            <!-- CTA -->
            <div class="cta-wrapper">
                <a href="[APP_URL]/shop" class="cta-button">
                    Explore the Collection
                </a>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="email-footer">
            <div class="footer-brand">Cleopatra Baklava</div>
            <div class="footer-address">
                Carrer de les Flors 14, Barcelona, Spain<br />
                hello@cleopatrabaklava.com &nbsp;·&nbsp; +34 93 123 4567
            </div>
            <div class="footer-links">
                <a href="[APP_URL]/shop">Shop</a>
                <a href="[APP_URL]/newarrivals">New Arrivals</a>
                <a href="[APP_URL]/mostpopular">Most Popular</a>
            </div>
            <div class="footer-divider"></div>
            <div class="footer-unsubscribe">
                You are receiving this email because you subscribed at cleopatrabaklava.com.<br />
                <a href="[APP_URL]">Unsubscribe</a>
            </div>
        </div>

    </div>
</body>
</html>
HTML;

        DB::table('settings')->insert([
            'key' => 'welcome_email_template',
            'value' => $template,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('settings')->where('key', 'welcome_email_template')->delete();
    }
};
