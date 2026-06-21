import argparse
import time
import requests
import sys
from datetime import datetime, timedelta

WEATHER_ENDPOINT = "/api/cep/weather"
STATUS_ENDPOINT  = "/api/cep/status"

SCENARIOS = {

    "gray_mold": {
        "description": "Scenario: Visok rizik od Botrytis cinerea (siva plesan)",
        "info": (
            "CEP Pravilo 1 se aktivira kada ukupne padavine > 40mm u 48h\n"
            "i temperatura između 10–20 °C.\n"
            "Ovaj scenario šalje 12 merenja u razmacima od 4h (=48h)."
        ),
        "measurements": [
            # (temp_C, humidity_%, rainfall_mm, offset_hours)
            (14.0, 82, 4.0,  0),
            (13.5, 85, 5.0,  4),
            (12.0, 88, 6.5,  8),
            (11.5, 90, 5.5, 12),
            (13.0, 87, 4.0, 16),
            (14.5, 84, 3.5, 20),
            (15.0, 80, 4.0, 24),
            (14.0, 83, 3.0, 28),
            (13.0, 86, 3.5, 32),
            (12.5, 89, 2.5, 36),
            (13.5, 88, 3.5, 40),
            (14.0, 85, 4.5, 44),  # Ukupno: ~50mm > 40mm → trigger!
        ],
    },

    "spider_mite": {
        "description": "Scenario: Visok rizik od Tetranychus urticae (žuti voćni pauk)",
        "info": (
            "CEP Pravilo 2 se aktivira kada prosečna temp > 30 °C u 72h\n"
            "i vlažnost konstantno < 40%.\n"
            "Ovaj scenario šalje 18 merenja u razmacima od 4h (=72h)."
        ),
        "measurements": [
            (31.0, 35, 0.0,  0),
            (32.5, 33, 0.0,  4),
            (33.0, 30, 0.0,  8),
            (34.5, 28, 0.0, 12),
            (35.0, 26, 0.0, 16),
            (33.5, 29, 0.0, 20),
            (31.5, 32, 0.0, 24),
            (32.0, 35, 0.0, 28),
            (34.0, 31, 0.0, 32),
            (35.5, 27, 0.0, 36),
            (36.0, 24, 0.0, 40),
            (34.5, 28, 0.0, 44),
            (33.0, 30, 0.0, 48),
            (32.5, 33, 0.0, 52),
            (31.5, 36, 0.0, 56),
            (33.0, 34, 0.0, 60),
            (34.0, 30, 0.0, 64),
            (35.0, 28, 0.0, 68),  # Prosek > 30°C, vlažnost < 40% → trigger!
        ],
    },

    "persistent_risk": {
        "description": "Scenario: PersistentHighRiskAlert (3+ rizik-eventi u 5 dana)",
        "info": (
            "CEP Pravilo 4 se aktivira kada je u 120h generisano >= 3\n"
            "InfectionRiskEvent-a. Ovaj scenario šalje 3 talasa kišnih\n"
            "merenja u razmacima od ~40h."
        ),
        "measurements": [
            # Talas 1 (aktivira InfectionRiskEvent #1)
            (14.0, 85, 8.0,   0),
            (13.5, 88, 9.0,   4),
            (13.0, 90, 9.5,   8),
            (12.5, 91, 7.0,  12),
            (13.0, 87, 7.5,  16),
            # Talas 2 (aktivira InfectionRiskEvent #2)
            (15.0, 82, 6.0,  40),
            (14.5, 84, 7.0,  44),
            (13.5, 86, 8.0,  48),
            (12.0, 89, 7.5,  52),
            (13.0, 88, 6.5,  56),
            # Talas 3 (aktivira InfectionRiskEvent #3 → PersistentHighRiskAlert!)
            (14.0, 85, 7.0,  82),
            (13.5, 87, 8.5,  86),
            (12.5, 90, 8.0,  90),
            (13.0, 88, 7.5,  94),
            (14.5, 84, 5.0,  98),
        ],
    },

    "treatment_wash": {
        "description": "Scenario: Pranje tretmana (CEP Pravilo 3)",
        "info": (
            "CEP Pravilo 3 se aktivira kada padne > 15mm kiše u 6h\n"
            "nakon registrovanog prskanja hemijom.\n"
            "Skripta prvo šalje SprayingEvent, zatim merenja sa intenzivnom kišom."
        ),
        "spray_event": True,
        "measurements": [
            (16.0, 75,  0.0, 0),
            (15.5, 78,  4.0, 1),
            (15.0, 80,  6.5, 2),
            (14.5, 83,  6.0, 3),   # < 6h od prskanja, ukupno > 15mm → ISPIRANO!
            (14.0, 85,  0.0, 6),
        ],
    },

    "normal": {
        "description": "Scenario: Normalni uslovi (bez okidanja CEP pravila)",
        "info": (
            "Standardni vremenski uslovi — umerena temperatura,\n"
            "vlažnost i minimalne padavine. Nema CEP alarma."
        ),
        "measurements": [
            (20.0, 60, 0.0,  0),
            (22.0, 58, 0.5,  4),
            (23.5, 55, 0.0,  8),
            (24.0, 57, 1.0, 12),
            (22.5, 59, 0.0, 16),
            (21.0, 61, 0.0, 20),
            (19.5, 63, 1.5, 24),
        ],
    },
}

class Color:
    RESET  = "\033[0m"
    BOLD   = "\033[1m"
    RED    = "\033[91m"
    GREEN  = "\033[92m"
    YELLOW = "\033[93m"
    CYAN   = "\033[96m"
    PURPLE = "\033[95m"
    GRAY   = "\033[90m"

def c(color, text):
    return f"{color}{text}{Color.RESET}"

def print_header(text):
    print(f"\n{Color.BOLD}{Color.PURPLE}{'═' * 60}{Color.RESET}")
    print(f"{Color.BOLD}{Color.PURPLE}  {text}{Color.RESET}")
    print(f"{Color.BOLD}{Color.PURPLE}{'═' * 60}{Color.RESET}")

def print_section(text):
    print(f"\n{Color.BOLD}{Color.CYAN}▶ {text}{Color.RESET}")

def print_ok(text):
    print(f"  {Color.GREEN}✓{Color.RESET}  {text}")

def print_warn(text):
    print(f"  {Color.YELLOW}⚠{Color.RESET}  {text}")

def print_err(text):
    print(f"  {Color.RED}✗{Color.RESET}  {text}")

def print_info(text):
    print(f"  {Color.GRAY}{text}{Color.RESET}")

def format_ts(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%dT%H:%M:%S")


def send_weather_measurement(base_url: str, measurement: dict, pseudo_time: datetime, use_pseudo_clock: bool = True):
    """Vraća (uspeh: bool, alerts: list) - backend odmah vraća listu RiskAlert
    objekata aktivnih nakon ovog merenja (vidi CepController.submitWeatherMeasurement)."""
    payload = {
        "temperature": measurement["temperature"],
        "humidity":    measurement["humidity"],
        "rainfall":    measurement["rainfall"],
        "location":    measurement["location"],
        "timestamp":   format_ts(pseudo_time),
    }
    try:
        r = requests.post(
            f"{base_url}{WEATHER_ENDPOINT}",
            params={"usePseudoClock": str(use_pseudo_clock).lower()},
            json=payload,
            timeout=5
        )
        if r.status_code in (200, 201, 202, 204):
            try:
                return True, r.json()
            except ValueError:
                return True, []
        else:
            print_warn(f"HTTP {r.status_code}: {r.text[:120]}")
            return False, []
    except requests.exceptions.ConnectionError:
        print_err(f"Nije moguće povezati se na {base_url}{WEATHER_ENDPOINT}")
        return False, []
    except Exception as e:
        print_err(f"Greška: {e}")
        return False, []


def send_spray_event(base_url: str, pseudo_time: datetime, use_pseudo_clock: bool = True) -> bool:
    payload = {
        "eventType": "SPRAYING_EXECUTED",
        "timestamp": format_ts(pseudo_time),
        "note": "Hemijsko prskanje (demo)"
    }
    try:
        r = requests.post(
            f"{base_url}/api/cep/spray",
            params={"usePseudoClock": str(use_pseudo_clock).lower()},
            json=payload,
            timeout=5
        )
        return r.status_code in (200, 201, 202, 204)
    except Exception as e:
        print_warn(f"SprayEvent nije poslat ({e}). Nastavlja se sa vremenskim merenjima.")
        return False


def check_alerts(base_url: str, use_pseudo_clock: bool = True) -> list:
    try:
        r = requests.get(
            f"{base_url}{STATUS_ENDPOINT}",
            params={"usePseudoClock": str(use_pseudo_clock).lower()},
            timeout=5
        )
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass
    return []

def reset_demo_session(base_url: str) -> bool:
    try:
        r = requests.post(f"{base_url}/api/cep/reset", timeout=5)
        return r.status_code in (200, 201, 204)
    except Exception as e:
        print_warn(f"Reset demo sesije nije uspeo ({e}). Prethodni eventi mogu uticati na rezultat.")
        return False


def run_scenario(args, scenario: dict):
    base_url = f"http://{args.host}:{args.port}"
    location = args.location
    measurements = scenario["measurements"]
    use_pseudo_clock = not args.realtime

    print_header("CEP Weather Event Simulator — Maline Ekspertski Sistem")
    print_section(scenario["description"])
    for line in scenario.get("info", "").split("\n"):
        print_info(line)

    now = datetime.now()
    pseudo_start = now - timedelta(hours=measurements[-1][3])  # vreme "prvog" merenja

    print_section(f"Pseudo-sat: {format_ts(pseudo_start)} → {format_ts(now)}")
    print_info(f"Backend:   {base_url}")
    print_info(f"Lokacija:  {location}")
    print_info(f"Merenja:   {len(measurements)}")
    print_info(f"Sat:       {'pseudo (ubrzano)' if use_pseudo_clock else 'realtime (sistemski)'}")

    if use_pseudo_clock and not args.no_reset:
        print_section("Resetovanje demo (pseudo-clock) sesije...")
        if reset_demo_session(base_url):
            print_ok("Demo sesija resetovana — kreće se sa čistom istorijom.")
        else:
            print_warn("Nastavlja se bez resetovanja sesije.")

    # Spray event (samo za treatment_wash scenario)
    if scenario.get("spray_event"):
        print_section("Slanje SprayingExecutedEvent...")
        spray_time = pseudo_start + timedelta(minutes=30)
        ok = send_spray_event(base_url, spray_time, use_pseudo_clock)
        if ok:
            print_ok(f"SprayEvent → {format_ts(spray_time)}")
        else:
            print_warn("SprayEvent nije potvrđen — provjeri /api/cep/spray endpoint.")

    print_section("Slanje WeatherMeasurement event-ova...")
    print()

    success_count = 0
    seen_alert_keys = set()
    for i, (temp, humidity, rainfall, offset_h) in enumerate(measurements):
        pseudo_time = pseudo_start + timedelta(hours=offset_h)

        payload_display = (
            f"T={temp:5.1f}°C  RV={humidity:5.1f}%  "
            f"Kiša={rainfall:5.1f}mm  "
            f"[{format_ts(pseudo_time)}]"
        )

        ok, alerts = send_weather_measurement(
            base_url,
            {"temperature": temp, "humidity": humidity,
             "rainfall": rainfall, "location": location},
            pseudo_time,
            use_pseudo_clock
        )

        if ok:
            success_count += 1
            print_ok(f"[{i+1:02d}/{len(measurements):02d}]  {payload_display}")
            # Prikaži samo NOVE alarme (koje ova skripta još nije ispisala)
            for alert in alerts:
                key = (alert.get("pathogen"), alert.get("riskLevel"), alert.get("recommendation"))
                if key not in seen_alert_keys:
                    seen_alert_keys.add(key)
                    level = alert.get("riskLevel", "")
                    pathogen = alert.get("pathogen", "")
                    rec = alert.get("recommendation", "")
                    icon = "🚨" if level == "URGENT" else "⚠️"
                    print(f"        {icon}  {c(Color.YELLOW, f'[{level}]')} {pathogen} → {rec}")
        else:
            print_err(f"[{i+1:02d}/{len(measurements):02d}]  GREŠKA  {payload_display}")

        # Malo pauze između event-ova (simulira procesiranje / vizuelni efekat na demou)
        if i < len(measurements) - 1:
            time.sleep(args.delay)

    print()
    print_section("Sažetak")
    print_ok(f"Uspešno poslato: {success_count}/{len(measurements)} merenja")

    if success_count < len(measurements):
        print_warn(f"Neuspešno: {len(measurements) - success_count} merenja")

    # Provjera alarma
    print_section("Provjera generisanih CEP alarma...")
    alerts = check_alerts(base_url, use_pseudo_clock)
    if alerts:
        for alert in alerts:
            level = alert.get("riskLevel", "")
            pathogen = alert.get("pathogen", "")
            rec = alert.get("recommendation", "")
            if level in ("HIGH", "URGENT"):
                print_warn(f"[{level}] {pathogen}: {rec}")
            else:
                print_ok(f"[{level}] {pathogen}: {rec}")
    else:
        print_info("Nema aktivnih alarma (ili /api/cep/status nije implementiran).")

    print()
    print(c(Color.BOLD, "✓ Simulacija završena."))
    print(c(Color.GRAY, f"  Datum simuliranog perioda: {format_ts(pseudo_start)} – {format_ts(now)}"))
    print()

def list_scenarios():
    print("\nDostupni scenariji:\n")
    for name, s in SCENARIOS.items():
        print(f"  {Color.CYAN}{name:<20}{Color.RESET}  {s['description']}")
    print()


def main():
    parser = argparse.ArgumentParser(
        description="CEP Weather Simulator za Ekspertski sistem dijagnoze malina"
    )
    parser.add_argument(
        "--scenario", "-s",
        choices=list(SCENARIOS.keys()),
        default=None,
        help="Naziv scenarija koji treba pokrenuti"
    )
    parser.add_argument("--host", default="localhost", help="Backend host (default: localhost)")
    parser.add_argument("--port", default="8081",     help="Backend port (default: 8081)")
    parser.add_argument("--location", default="Čačak", help="Naziv lokacije (default: Čačak)")
    parser.add_argument("--list", "-l", action="store_true", help="Prikaži dostupne scenarije")
    parser.add_argument("--realtime", action="store_true",
                         help="Koristi realtime sesiju (sistemski sat) umesto pseudo-clock demo sesije")
    parser.add_argument("--delay", type=float, default=0.4,
                         help="Pauza (u sekundama) između slanja merenja, radi vizuelnog efekta na demou (default: 0.4)")
    parser.add_argument("--no-reset", action="store_true",
                         help="Ne resetuj pseudo-clock sesiju pre pokretanja scenarija")

    args = parser.parse_args()

    if args.list or args.scenario is None:
        list_scenarios()
        if args.scenario is None and not args.list:
            parser.print_help()
        sys.exit(0)

    scenario = SCENARIOS[args.scenario]
    run_scenario(args, scenario)


if __name__ == "__main__":
    main()