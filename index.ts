// input.txt have accounts in format:
// username:password:email:email_password:auth_token
// will save output.csv with columns auth_token,csrf_token

const input_file = (await Bun.file("input.txt").text()).split("\n");

const input = input_file.map((item) => {
	const [username, password, email, email_password, token] = item.split(":");

	return {
		username,
		password,
		email,
		email_password,
		token,
	};
});

let result = "auth_token,csrf_token\n";
let total = 0;

for (const account of input) {
	const w = await new Promise((resolve) => setTimeout(resolve, 2000));
	const { username, token } = account;

	if (!token) {
		console.error(`Account ${username} doesn't have token`);
		continue;
	}

	try {
		const req = await fetch("https://x.com/", {
			headers: {
				accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
				"accept-language": "ru",
				"cache-control": "max-age=0",
				priority: "u=0, i",
				"sec-ch-ua":
					'"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
				"sec-ch-ua-mobile": "?0",
				"sec-ch-ua-platform": '"macOS"',
				"sec-fetch-dest": "document",
				"sec-fetch-mode": "navigate",
				"sec-fetch-site": "same-origin",
				"sec-fetch-user": "?1",
				"upgrade-insecure-requests": "1",
				cookie: `auth_token=${token}`,
				Referer: "https://twitter.com/",
				"Referrer-Policy": "strict-origin-when-cross-origin",
			},
			body: null,
			method: "GET",
		});

		const set_cookies = req.headers.getSetCookie();

		const tk = set_cookies.find((item) => item.startsWith("auth_token=;"));
		if (tk) {
			console.error(`Account ${username} token doesn't work`);
			continue;
		}

		const ct0 = set_cookies.find((item) => item.startsWith("ct0"));
		if (!ct0) {
			console.error(`Account ${username} didn't got csrf token, try later`);
			continue;
		}

		const csrf_token = ct0.split(";")[0].replace("ct0=", "");
		console.log(`Account ${username} working`);
		++total;
		result += `${token},${csrf_token}\n`;
	} catch (err) {
		if (err instanceof Error) {
			console.error(`Can't connect to twitter, account ${username}: ${err}`);
		}
	}
}
console.log(`Total working accounts ${total}`);
await Bun.write("output.csv", result);
