# get_token

[Guide here](https://0h5imw.notion.site/How-to-buy-and-check-twitter-accounts-208c2268fa0e4363ad6c1dc80aedf546?pvs=4)

Save accounts to input.txt file each account on new line in format:
```
username:password:email:email_password:auth_token
```

Run: 
```bash
node index.ts
```

Will check acccounts and save only working one to `output.csv` with columns `auth_token,csrf_token`
