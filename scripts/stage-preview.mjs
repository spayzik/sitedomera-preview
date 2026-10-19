import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
const [input, output] = process.argv.slice(2);
assert(input && output, 'Usage: node stage-preview.mjs <verified dist> <new staging directory>');
const source=resolve(input), target=resolve(output);
assert(source!==target && !existsSync(target), 'Stage into a new directory, never modify the production dist');
assert(existsSync(join(source,'index.html')), 'Verified production dist required');
mkdirSync(target,{recursive:true});cpSync(source,target,{recursive:true});
let html=readFileSync(join(target,'index.html'),'utf8');
assert.equal((html.match(/<meta\s+name="robots"/g)||[]).length,1);
html=html.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?\s*>/,'<meta name="robots" content="noindex, nofollow, noarchive" />');
const notice='<aside class="preview-notice" aria-label="Тестовая версия">Тестовая версия каталога — данные и изображения уточняются</aside>';
html=html.replace('</head>','<style>.preview-notice{position:fixed;inset:0 0 auto;z-index:11000;box-sizing:border-box;margin:0;padding:2px 4px;background:rgba(32,26,19,.94);color:#dbc9ab;font:10px/16px system-ui,sans-serif;text-align:center;pointer-events:none}</style></head>');
html=html.replace('<body>','<body>'+notice);
writeFileSync(join(target,'index.html'),html);
writeFileSync(join(target,'robots.txt'),'User-agent: *\nDisallow: /\n');
rmSync(join(target,'sitemap.xml'),{force:true});
writeFileSync(join(target,'preview-source.json'),JSON.stringify({repository:'spayzik/sitedomera',sha:'65b1e54e7e35441795ed7307ae95b381f32e1823',purpose:'Owner visual review; not production'},null,2)+'\n');
assert(html.includes('content="noindex, nofollow, noarchive"'));
assert(html.includes(notice));assert(!existsSync(join(target,'sitemap.xml')));
assert(!readFileSync(join(target,'robots.txt'),'utf8').includes('Sitemap:'));
for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
 const url=match[1];if(/^(https?:|data:)/.test(url))continue;
 const resolved=new URL(url,'https://spayzik.github.io/sitedomera-preview/');
 assert(resolved.pathname.startsWith('/sitedomera-preview/'),`Asset escapes preview subpath: ${url}`);
 assert(existsSync(join(target,resolved.pathname.slice('/sitedomera-preview/'.length))),`Missing asset: ${url}`);
}
console.log('Staging protections and /sitedomera-preview/ index assets verified. Production dist untouched.');
