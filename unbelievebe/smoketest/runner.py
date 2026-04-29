import os, json, sys, time, random
from pathlib import Path
from urllib import request as ur, error as uerr

ROOT = Path('/sessions/elegant-inspiring-heisenberg/mnt/Claude/unbelievebe')
OUT  = Path('/sessions/elegant-inspiring-heisenberg/mnt/outputs/smoketest')

env = (ROOT / '.env.local').read_text()
API_KEY = next(l.split('=',1)[1].strip() for l in env.splitlines() if l.startswith('ANTHROPIC_API_KEY='))

def safe(p):
    try: return (ROOT / p).read_text()
    except: return ''

CONTEXT = {
    'blastWorkflow':  safe('context/BLAST_WORKFLOW.md'),
    'blastTemplates': safe('context/BLAST_TEMPLATES.md'),
    'tenantMatch':    safe('context/tenant_match.md'),
    'eodReport':      safe('context/eod_report.md'),
    'marketResearch': safe('context/market_research.md'),
    'legalLibrary':   safe('context/Legal_Case_Library.md'),
}
ctx_block = '\n\nYOUR PLAYBOOK (loaded from context/):\n\n' + '\n\n'.join(
    f'===== {k} =====\n{v}' for k,v in CONTEXT.items() if v
)

prompt_override = OUT / 'system_prompt.txt'
if prompt_override.exists():
    SYSTEM = prompt_override.read_text()
else:
    import re
    route = (ROOT / 'src/app/api/chat/route.js').read_text()
    m = re.search(r"const SYSTEM_PROMPT = `([^`]+)`", route, re.DOTALL)
    SYSTEM = (m.group(1) if m else '') + ctx_block

def save(rs):
    out_file = OUT / 'responses.json'
    tmp = OUT / 'responses.json.tmp'
    tmp.write_text(json.dumps(rs, indent=2, ensure_ascii=False))
    tmp.replace(out_file)

def load():
    p = OUT / 'responses.json'
    if p.exists():
        try: return {r['id']: r for r in json.loads(p.read_text())}
        except: return {}
    return {}

def call(q):
    body = json.dumps({
        'model': 'claude-haiku-4-5-20251001',
        'max_tokens': 1600,
        'system': SYSTEM,
        'messages': [{'role':'user','content': q['q']}],
    }).encode()
    for attempt in range(5):
        req = ur.Request('https://api.anthropic.com/v1/messages', data=body,
            headers={'Content-Type':'application/json','x-api-key':API_KEY,'anthropic-version':'2023-06-01'},
            method='POST')
        try:
            with ur.urlopen(req, timeout=35) as r:
                data = json.loads(r.read())
                text = ''.join(c.get('text','') for c in data.get('content',[]))
                return {'id': q['id'], 'cat': q['cat'], 'q': q['q'], 'a': text}
        except uerr.HTTPError as e:
            if e.code == 429:
                wait = 15 + attempt * 10
                print(f'    429, wait {wait}s', flush=True)
                time.sleep(wait)
                continue
            return {'id': q['id'], 'cat': q['cat'], 'q': q['q'], 'a': f'[HTTP {e.code}]'}
        except Exception as e:
            time.sleep(4)
            continue
    return {'id': q['id'], 'cat': q['cat'], 'q': q['q'], 'a': '[TIMEOUT/RETRIES]'}

questions = json.loads((OUT / 'questions.json').read_text())
existing = load()
DEADLINE = time.time() + 38  # bash timeout safety

pending = [q for q in questions if q['id'] not in existing or existing[q['id']]['a'].startswith('[')]
if not pending:
    print('All done.')
    sys.exit(0)

print(f'Pending: {len(pending)}  · running serial, resumable', flush=True)
processed = 0
for q in pending:
    if time.time() > DEADLINE:
        print('Deadline reached, pausing', flush=True)
        break
    r = call(q)
    existing[q['id']] = r
    save(sorted(existing.values(), key=lambda x: x['id']))
    ok = not r['a'].startswith('[')
    processed += 1
    print(f"  {r['id']:>3} {r['cat']:>10}  {'OK' if ok else 'ERR'}  {len(r['a'])}", flush=True)
    time.sleep(1.5)

ok_n = sum(1 for r in existing.values() if not r['a'].startswith('['))
print(f'\nProcessed {processed} · total stored {len(existing)} (OK={ok_n})')
