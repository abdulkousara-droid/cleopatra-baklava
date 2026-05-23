@php
$appUrl = config('app.url');
$paragraphs = explode("\n\n", $body);
$footerAddress = \App\Models\Setting::where('key', 'email_footer_address')->value('value') ?? 'Carrer de les Flors 14, Barcelona, Spain';
@endphp
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>{{ $subject }}</title>
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

        .offer-badge {
            display: inline-block;
            background: #c9a84c;
            color: #1e1b14;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 3px;
            text-transform: uppercase;
            padding: 8px 18px;
            margin-bottom: 20px;
        }

        .welcome-heading {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: 32px;
            font-weight: 600;
            color: #1e1b14;
            line-height: 1.2;
            margin-bottom: 24px;
        }

        .welcome-text {
            font-size: 15px;
            color: #4d4637;
            line-height: 1.8;
            margin-bottom: 16px;
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
            white-space: pre-line;
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
        }
    </style>
</head>
<body>
    <div class="email-wrapper">

        <div class="email-header">
            <span class="brand-name">Cleopatra Baklava</span>
            <span class="brand-tagline">Artisanal Mediterranean Confections</span>
        </div>

        <div class="email-body">
            <div class="geometric-divider">◆ &nbsp; ◆ &nbsp; ◆</div>

            <div style="text-align:center;">
                <span class="offer-badge">✦ Exclusive Offer</span>
            </div>

            <h1 class="welcome-heading" style="text-align:center;">
                {{ $subject }}
            </h1>

            @foreach($paragraphs as $paragraph)
                @if(trim($paragraph))
                    <p class="welcome-text">{{ $paragraph }}</p>
                @endif
            @endforeach

            @if($ctaText && $ctaLink)
                <div class="cta-wrapper">
                    <a href="{{ $ctaLink }}" class="cta-button">
                        {{ $ctaText }}
                    </a>
                </div>
            @endif
        </div>

        <div class="email-footer">
            <div class="footer-brand">Cleopatra Baklava</div>
            <div class="footer-address">{{ $footerAddress }}</div>
            <div class="footer-links">
                <a href="{{ $appUrl }}/shop">Shop</a>
                <a href="{{ $appUrl }}/newarrivals">New Arrivals</a>
                <a href="{{ $appUrl }}/mostpopular">Most Popular</a>
            </div>
            <div class="footer-divider"></div>
            <div class="footer-unsubscribe">
                You are receiving this email because you subscribed at cleopatrabaklava.com.<br />
                <a href="{{ $appUrl }}">Unsubscribe</a>
            </div>
        </div>

    </div>
</body>
</html>
