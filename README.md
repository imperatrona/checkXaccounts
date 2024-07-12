# get_token

Save accounts to input.txt file each account on new line in format:
```
username:password:email:email_password:auth_token
```
Run: 
```bash
bun run index.ts
```

Will check acccounts and save only working one to `output.csv` with columns `auth_token,csrf_token`
