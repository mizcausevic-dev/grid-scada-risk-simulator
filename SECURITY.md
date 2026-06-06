# Security

This repository uses synthetic SCADA and utility operations data only. Do not commit real control-system identifiers, grid topology, customer data, credentials, hostnames, SSH keys, FTP credentials, or internal file paths.

Before publishing changes, run `npm run verify` plus a strict local path and secret marker scan.
