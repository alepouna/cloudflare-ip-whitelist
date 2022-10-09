import fetch from 'node-fetch';
import fs from 'fs';
import config from './config.mjs';

console.log('Fetching data...');

//Fetch IPv4 
const ipv4 = await fetch('https://www.cloudflare.com/ips-v4');

//Take every line and split it into an array
const ipv4Array = (await ipv4.text()).split('\n');

//Fetch IPv6
const ipv6 = await fetch('https://www.cloudflare.com/ips-v6');

//Take every line and split it into an array
const ipv6Array = (await ipv6.text()).split('\n');

console.log('Storing data...');

//Combine the two arrays
const cloudflareIPs = ipv4Array.concat(ipv6Array);

//Create nginx config format 
const nginxConfig = cloudflareIPs.map(ip => `allow ${ip};`).join('\n');

const text = `# This config file allows Cloudflare IPs and denies everything else\n# Generated at ${new Date()}\n${nginxConfig}\n\ndeny all; # Deny all other IPs`

//Write the config to a file
fs.writeFileSync(`${config.config_path}`, text);

console.log('Done!');