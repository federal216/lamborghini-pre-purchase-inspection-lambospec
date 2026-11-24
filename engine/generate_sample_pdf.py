import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

# Theme Palette (Lamborghini Aggressive High-Tech Dark)
C_BG = colors.HexColor("#08090d")
C_SURFACE = colors.HexColor("#0f121a")
C_SURFACE_ALT = colors.HexColor("#141924")
C_BORDER = colors.HexColor("#1f293d")
C_ORANGE = colors.HexColor("#f97316")
C_ORANGE_GLOW = colors.HexColor("#ea580c")
C_TEXT_WHITE = colors.HexColor("#f8fafc")
C_TEXT_MUTED = colors.HexColor("#94a3b8")
C_TEXT_ACCENT = colors.HexColor("#38bdf8")
C_SUCCESS_TEXT = colors.HexColor("#34d399")
C_DANGER_TEXT = colors.HexColor("#f87171")

TOTAL_PAGES = 10

class LamboNumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        self.setStrokeColor(C_ORANGE)
        self.setLineWidth(1.5)
        self.line(40, 755, 572, 755)

        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(C_TEXT_WHITE)
        self.drawString(40, 762, "LAMBOSPEC AI — PRE-PURCHASE INSPECTION & NEGOTIATION DOSSIER")
        
        self.setFont("Courier-Bold", 7)
        self.setFillColor(C_ORANGE)
        self.drawRightString(572, 762, "VIN SECURITY HASH: LMB-2026-HUR-914")

        self.setStrokeColor(C_BORDER)
        self.setLineWidth(1)
        self.line(40, 42, 572, 42)

        self.setFont("Helvetica", 7)
        self.setFillColor(C_TEXT_MUTED)
        self.drawString(40, 32, "LAMBOSPEC SUPERCAR INTELLIGENCE • CERTIFIED PRE-PURCHASE SECONDARY AUDIT")
        self.drawRightString(572, 32, f"PAGE {self._pageNumber} OF {total_pages} (OFFICIAL 10-PAGE DOSSIER)")

def draw_background(c, doc):
    c.saveState()
    c.setFillColor(C_BG)
    c.rect(0, 0, 612, 792, fill=True, stroke=False)
    c.setFont("Helvetica-Bold", 42)
    c.setFillColor(colors.HexColor("#1e293b"), alpha=0.06)
    c.saveState()
    c.translate(306, 396)
    c.rotate(45)
    c.drawCentredString(0, 0, "CERTIFIED SUPERCAR AUDIT")
    c.restoreState()
    c.restoreState()

def build_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=50,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()

    style_h1 = ParagraphStyle(
        'DocH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=C_TEXT_WHITE,
        spaceAfter=4
    )
    style_subtitle = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=C_ORANGE,
        spaceAfter=11
    )
    style_body = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=C_TEXT_MUTED,
        spaceAfter=6
    )
    style_strong_body = ParagraphStyle(
        'DocStrongBody',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11.5,
        textColor=C_TEXT_WHITE,
        spaceAfter=6
    )
    style_section_title = ParagraphStyle(
        'SecTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=C_ORANGE,
        spaceBefore=7,
        spaceAfter=4
    )

    story = []

    # ---------------- PAGE 1 ----------------
    story.append(Paragraph("EXECUTIVE PRE-PURCHASE VALUATION & SPREAD MATRIX", style_h1))
    story.append(Paragraph("TARGET ASSET: 2016 LAMBORGHINI HURACAN LP610-4 COUPE (14,200 MILES)", style_subtitle))

    asset_data = [
        [Paragraph("<b>Engine Spec:</b> 5.2L Naturally Aspirated V10 (602 hp)", style_body), Paragraph("<b>Transmission:</b> 7-Speed LDF Dual-Clutch (Doppia Frizione)", style_body)],
        [Paragraph("<b>All-Wheel Drive:</b> Haldex Generation V Electronically Controlled", style_body), Paragraph("<b>Mileage Inspected:</b> 14,200 Verified Miles", style_body)],
        [Paragraph("<b>Assembly Plant:</b> Sant'Agata Bolognese, Italy", style_body), Paragraph("<b>Listing Source:</b> Bring a Trailer Private Auction Listing", style_body)],
        [Paragraph("<b>Options Installed:</b> Transparent Engine Bonnet, Sport Exhaust", style_body), Paragraph("<b>Critical Missing Option:</b> <font color='#f87171'><b>NO FRONT AXLE LIFT</b></font>", style_body)]
    ]
    t_asset = Table(asset_data, colWidths=[266, 266])
    t_asset.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_SURFACE),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_asset)
    story.append(Spacer(1, 10))

    story.append(Paragraph("PRIMARY VALUATION & DEALER SPREAD MATRIX", style_section_title))
    val_data = [
        [
            Paragraph("<b>SELLER ASKING PRICE</b><br/><font size='13' color='#ffffff'><b>$218,000</b></font><br/><font color='#94a3b8' size='7'>Dealer Listed Ask</font>", style_body),
            Paragraph("<b>VERIFIED COMP BENCHMARK</b><br/><font size='13' color='#34d399'><b>$194,500</b></font><br/><font color='#94a3b8' size='7'>Auction Historical Avg</font>", style_body),
            Paragraph("<b>MAX FIRM COUNTER-OFFER</b><br/><font size='13' color='#f97316'><b>$182,000</b></font><br/><font color='#94a3b8' size='7'>Risk-Adjusted Wire Target</font>", style_body)
        ]
    ]
    t_val = Table(val_data, colWidths=[177, 177, 178])
    t_val.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_SURFACE_ALT),
        ('BOX', (0,0), (-1,-1), 1.5, C_ORANGE),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 7),
        ('BOTTOMPADDING', (0,0), (-1,-1), 7),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ]))
    story.append(t_val)
    story.append(Spacer(1, 10))

    story.append(Paragraph("APPLIED VALUE DEDUCTION AUDIT", style_section_title))
    ded_data = [
        [Paragraph("<b>Missing Front Axle Lifting System (Resale Market Penalty)</b>", style_body), Paragraph("<font color='#f87171'><b>-$10,000</b></font>", style_body)],
        [Paragraph("<b>CCB Rotor Microscopic Matrix Oxidation (Front Left & Right)</b>", style_body), Paragraph("<font color='#f87171'><b>-$8,500</b></font>", style_body)],
        [Paragraph("<b>MagneRide Suspension Strut Seepage (Front Pair Overhaul)</b>", style_body), Paragraph("<font color='#f87171'><b>-$3,200</b></font>", style_body)],
        [Paragraph("<b>Upcoming 15,000-Mile Spark Plug & Fluid Major Service</b>", style_body), Paragraph("<font color='#f87171'><b>-$1,800</b></font>", style_body)],
        [Paragraph("<b>TOTAL JUSTIFIED NEGOTIATION DEDUCTION:</b>", style_strong_body), Paragraph("<font color='#f97316'><b>-$23,500</b></font>", style_strong_body)]
    ]
    t_ded = Table(ded_data, colWidths=[400, 132])
    t_ded.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-2), C_SURFACE),
        ('BACKGROUND', (0,-1), (-1,-1), C_SURFACE_ALT),
        ('BOX', (0,0), (-1,-1), 1, C_ORANGE_GLOW),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ALIGN', (1,0), (1,-1), 'RIGHT'),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_ded)

    # ---------------- PAGE 2 ----------------
    story.append(PageBreak())
    story.append(Paragraph("CARBON CERAMIC BRAKES (CCB) & ROTOR WEIGHT AUDIT", style_h1))
    story.append(Paragraph("FOUR-CORNER ROTOR OXIDATION & REPLACEMENT TRAP VERIFICATION", style_subtitle))
    story.append(Paragraph("Carbon Ceramic Matrix Oxidation Physics", style_section_title))
    story.append(Paragraph(
        "Lamborghini Carbon Ceramic Brake (CCB) rotors do not wear down by thickness like iron rotors; instead, they lose weight through microscopic carbon fiber oxidation under high thermal cycling. Each rotor has its minimum permissible weight stamped on the aluminum center hat (e.g. 5,420g). A rotor with 95% visual thickness can be completely condemned if it falls 15 grams below minimum weight, triggering an immediate $26,000 four-corner replacement cost.",
        style_body
    ))
    ccb_table = [
        [Paragraph("<b>Wheel Position</b>", style_strong_body), Paragraph("<b>Stamped Min Weight</b>", style_strong_body), Paragraph("<b>Observed Weight</b>", style_strong_body), Paragraph("<b>Status & Recommendation</b>", style_strong_body)],
        [Paragraph("Front Left (FL)", style_body), Paragraph("5,420 g", style_body), Paragraph("5,435 g (Marginal)", style_body), Paragraph("接近临界 (Wear remaining: 18%)", style_body)],
        [Paragraph("Front Right (FR)", style_body), Paragraph("5,420 g", style_body), Paragraph("5,441 g (Marginal)", style_body), Paragraph("Track heat oxidation detected", style_body)],
        [Paragraph("Rear Left (RL)", style_body), Paragraph("4,890 g", style_body), Paragraph("4,930 g (Acceptable)", style_body), Paragraph("Healthy (Wear remaining: 42%)", style_body)],
        [Paragraph("Rear Right (RR)", style_body), Paragraph("4,890 g", style_body), Paragraph("4,925 g (Acceptable)", style_body), Paragraph("Healthy (Wear remaining: 39%)", style_body)]
    ]
    t_ccb = Table(ccb_table, colWidths=[110, 120, 130, 172])
    t_ccb.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_SURFACE_ALT),
        ('BACKGROUND', (0,1), (-1,-1), C_SURFACE),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(Spacer(1, 6))
    story.append(t_ccb)

    # ---------------- PAGE 3 ----------------
    story.append(PageBreak())
    story.append(Paragraph("LDF DUAL-CLUTCH & E-GEAR TELEMETRY AUDIT", style_h1))
    story.append(Paragraph("SNAP READINGS, FRICTION COEFFICIENT & LAUNCH CONTROL STRESS", style_subtitle))
    story.append(Paragraph("Lamborghini Doppia Frizione (LDF) Electronic Health", style_section_title))
    story.append(Paragraph(
        "Huracán LP610-4 models feature the 7-speed wet dual-clutch transmission (DL800). Unlike older single-clutch e-Gear Gallardo units, the LDF clutch is designed for 70,000+ miles. However, aggressive standing launch control activations cause rapid thermal degradation of Clutch 1 (odd gears) and Clutch 2 (even gears). Diagnosing the transmission via Lamborghini LDAS / ODIS reveals exact launch history and kiss point adaptations.",
        style_body
    ))
    clutch_table = [
        [Paragraph("<b>Diagnostic Parameter</b>", style_strong_body), Paragraph("<b>OEM Factory Spec</b>", style_strong_body), Paragraph("<b>Current Vehicle Reading</b>", style_strong_body)],
        [Paragraph("Launch Control Counter", style_body), Paragraph("< 15 life activations", style_body), Paragraph("28 launches recorded in TCU", style_body)],
        [Paragraph("Clutch 1 Kiss Point Offset", style_body), Paragraph("± 0.25 mm nominal", style_body), Paragraph("+ 0.48 mm (Moderate friction plate wear)", style_body)],
        [Paragraph("Clutch 2 Kiss Point Offset", style_body), Paragraph("± 0.25 mm nominal", style_body), Paragraph("+ 0.32 mm (Acceptable)", style_body)],
        [Paragraph("TCU Hydraulic Fluid Temp Peak", style_body), Paragraph("< 135°C track threshold", style_body), Paragraph("142°C historical peak (Over-temp logged)", style_body)]
    ]
    t_clutch = Table(clutch_table, colWidths=[150, 182, 200])
    t_clutch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), C_SURFACE_ALT),
        ('BACKGROUND', (0,1), (-1,-1), C_SURFACE),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(Spacer(1, 6))
    story.append(t_clutch)

    # ---------------- PAGE 4 ----------------
    story.append(PageBreak())
    story.append(Paragraph("FRONT AXLE LIFTING SYSTEM & SUSPENSION HYDRAULICS", style_h1))
    story.append(Paragraph("HYDRAULIC PRESSURE DECAY, PUMP CYCLES & RESALE IMPACT", style_subtitle))
    story.append(Paragraph("Why the Missing Lift System Wipes Out $10,000 in Value", style_section_title))
    story.append(Paragraph(
        "The optional Front Axle Lifting System raises the Huracán nose by 45mm to clear speed bumps and driveways. In the secondary supercar market, Huracáns lacking front lift are notoriously difficult to resell, sitting on dealer lots 3x longer than equipped cars. We deduct a flat $10,000 to compensate for future liquidity friction and front carbon splitter scrape risks.",
        style_body
    ))
    story.append(Paragraph("MagneRide Strut Leakage Diagnostics", style_section_title))
    story.append(Paragraph(
        "MagneRide dampers utilize magnetorheological fluid whose viscosity changes with magnetic field intensity. Pitted chrome shock shafts degrade internal wiper seals, allowing fluid misting. Both front struts on this vehicle display light oily weeping around the lower spring perches, justifying an immediate $3,200 repair deduction.",
        style_body
    ))

    # ---------------- PAGE 5 ----------------
    story.append(PageBreak())
    story.append(Paragraph("CARBON COMPOSITE MONOCOQUE & PAINT DEPTH AUDIT", style_h1))
    story.append(Paragraph("ULTRASONIC BULKHEAD SCAN & SUB-SURFACE CRASH REPAIR DETECTION", style_subtitle))
    story.append(Paragraph("Hybrid Carbon-Aluminum Chassis Integrity", style_section_title))
    story.append(Paragraph(
        "The Huracán monocoque combines a carbon fiber passenger cell (RTM) with aluminum front/rear crash structures. Ultrasonic inspection verifies zero delamination along the A-pillars and firewall bulkhead. A paint depth gauge inspection across all 14 body panels confirms original factory paint (3.8 to 4.9 mils), ruling out prior collision resprays.",
        style_body
    ))

    # ---------------- PAGE 6 ----------------
    story.append(PageBreak())
    story.append(Paragraph("DME ENGINE CONTROL UNIT & OVER-REV RANGES 1-6", style_h1))
    story.append(Paragraph("MECHANICAL OVER-REV TELEMETRY & ECU TUNE FLASH COUNTER", style_subtitle))
    story.append(Paragraph("Range 1 Through Range 6 Over-Rev Definitions", style_section_title))
    story.append(Paragraph(
        "Electronic rev limiters prevent over-revving on throttle, but mechanical downshift over-revs (money shifts) force the valvetrain past redline. Range 1-2 ignitions occur under normal spirited driving. Range 4-6 ignitions (above 9,100 RPM) cause valve-float, piston-to-valve contact, and immediately void all factory warranty and goodwill engine replacements.",
        style_body
    ))

    # ---------------- PAGE 7 ----------------
    story.append(PageBreak())
    story.append(Paragraph("TITANIUM SPORT EXHAUST & EMISSION CATALYSTS", style_h1))
    story.append(Paragraph("VALVED BYPASS ACTUATORS & CATALYTIC CONVERTER HEALTH", style_subtitle))
    story.append(Paragraph("Exhaust Valve Solenoid Vacuum Diagnostics", style_section_title))
    story.append(Paragraph(
        "The Lamborghini Sport Exhaust utilizes dual pneumatic butterfly valves controlled by ANIMA drive modes (Strada, Sport, Corsa). Stuck valves create intense backpressure in Strada mode or trigger check-engine codes under wide-open throttle. Both actuators tested fully functional.",
        style_body
    ))

    # ---------------- PAGE 8 ----------------
    story.append(PageBreak())
    story.append(Paragraph("COMPLETE MODEL REGISTRY & OPTIONS AUDIT", style_h1))
    story.append(Paragraph("HISTORICAL BENCHMARK: GALLARDO, HURACAN, AVENTADOR & REVUELTO", style_subtitle))
    story.append(Paragraph("Cross-Model Secondary Market Depreciation Curve", style_body))
    story.append(Paragraph(
        "Analysis across 94+ production Lamborghini models confirms naturally aspirated V10 platforms retain 78% of MSRP after 8 years. However, individual option selection dictates pricing: front lift (+7%), transparent engine bonnet (+4%), carbon skin interior (+5%), standard steel brakes (-12%).",
        style_body
    ))

    # ---------------- PAGE 9 ----------------
    story.append(PageBreak())
    story.append(Paragraph("PRE-WIRE ESCROW & TRANSPORT SAFETY PROTOCOL", style_h1))
    story.append(Paragraph("MANDATORY WIRE PROTECTION FOR REMOTE SUPERCAR ACQUISITIONS", style_subtitle))
    escrow_points = [
        "1. Never send direct bank wires to private seller checking accounts; mandate Escrow.com vehicle title service.",
        "2. Demand title lien payoff verification directly with lender (e.g. Lamborghini Financial Services) before wiring.",
        "3. Mandate authorized dealership Pre-Purchase Inspection (PPI) on a two-post lift before releasing deposit.",
        "4. Require closed-trailer enclosed transport (Reliable Carriers, Plycar, or Intercity Lines) with $250k cargo insurance.",
        "5. Conduct high-definition video bill of lading (BOL) inspection before vehicle is driven onto transport ramp."
    ]
    for pt in escrow_points:
        story.append(Paragraph(f"• {pt}", style_body))

    # ---------------- PAGE 10 ----------------
    story.append(PageBreak())
    story.append(Paragraph("VERBATIM DEALER NEGOTIATION SCRIPT", style_h1))
    story.append(Paragraph("UNEMOTIONAL COUNTER-OFFER FOR BRING A TRAILER & SUPERCAR BROKERS", style_subtitle))
    
    script_text = (
        "<i>\"Hello [Seller/Dealer], thank you for the detailed presentation of the 2016 Huracan LP610-4. "
        "Our pre-purchase audit identifies a clean chassis and verified 14,200 miles, but uncovers three substantial equity traps: "
        "the lack of front axle lift (-$10,000 resale penalty), marginal CCB front rotor oxidation (-$8,500 replacement reserve), "
        "and weeping front MagneRide shocks (-$3,200). "
        "Factoring in these mechanical adjustments against verified auction comps, my firm purchase offer is <b>$182,000 USD</b>. "
        "I am pre-approved for immediate wire transfer through an independent automotive escrow service upon agreement.\"</i>"
    )
    t_script = Table([[Paragraph(script_text, style_body)]], colWidths=[532])
    t_script.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_SURFACE_ALT),
        ('BOX', (0,0), (-1,-1), 1.5, C_ORANGE),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(t_script)
    story.append(Spacer(1, 12))

    sign_data = [
        [Paragraph("<b>Lead Supercar Inspector:</b> Marco Bellini, Senior Exotics Engineer", style_body), Paragraph("<b>Audit Platform:</b> LamboSpec AI Autonomous V4.1", style_body)],
        [Paragraph("<b>Inspection Standard:</b> Sant'Agata Pre-Purchase Technical Protocol", style_body), Paragraph("<b>Verification Hash:</b> 7d89b14e2c0a91f5", style_body)],
        [Paragraph("<b>Status:</b> RISK-ADJUSTED FOR WIRE TRANSFER", style_strong_body), Paragraph("<b>Firm Offer Target:</b> $182,000 USD", style_strong_body)]
    ]
    t_sign = Table(sign_data, colWidths=[266, 266])
    t_sign.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), C_SURFACE),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_sign)

    doc.build(
        story,
        onFirstPage=draw_background,
        onLaterPages=draw_background,
        canvasmaker=LamboNumberedCanvas
    )
    print(f"[+] 10-Page Master Lamborghini Pre-Purchase Dossier built: {output_path}")

if __name__ == '__main__':
    out = os.path.join(os.path.dirname(__file__), '..', 'sample_report.pdf')
    build_pdf(out)
