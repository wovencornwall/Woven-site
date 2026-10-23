# WOVEN · wovencornwall.com

The website for WOVEN, wedding and event coordination in Cornwall. *Your story. Expertly woven.*

It's a plain website (HTML pages, one stylesheet, photos), hosted free on GitHub Pages. The domain stays registered with Wix, along with the zoe@wovencornwall.com mailbox.

## What's in here

| File | What it is |
|---|---|
| `index.html` | Home |
| `about.html` | About Zoë |
| `philosophy.html` | Philosophy and values |
| `services.html` | Wedding packages and social content for brands |
| `journal.html` | Journal posts |
| `contact.html` | Enquiry form |
| `thanks.html` | Page shown after someone sends an enquiry |
| `404.html` | Page shown for a broken link |
| `styles.css` | All colours, fonts and layout |
| `tex/` | The embroidered logo: linen swatch for the homepage, sage version for the header, W monogram for the footer and icons |
| `img/` | Photos |
| `logo.png` | Zoë's handwritten "Woven" logo |
| `CNAME` | Tells GitHub the site lives at wovencornwall.com |

Brand colours (in `styles.css`): light beige `#F6F2EB`, deeper beige `#EDE6DA`, hairlines `#DCD3C4`, earthy ink `#3A352E`, deep sage accent `#4E5A47`. Type: Bodoni Moda capitals for headings, italics for prices and asides, EB Garamond for text. Photos and buttons have rounded corners. The logo is an original W monogram (two threads interlacing) above Zoë's handwritten name, embroidered.


## The enquiry form

Enquiries are sent to zoe@wovencornwall.com by FormSubmit (formsubmit.co), a free service that needs no account.

The very first time someone sends the form, FormSubmit emails zoe@wovencornwall.com asking to confirm. Click the confirm link once, and every enquiry after that arrives straight in the inbox. Send a test enquiry yourself as soon as the site is live so this happens before a real couple writes in.

## Putting it live

### 1. Publish on GitHub

1. Put these files in a GitHub repository (for example `woven-site`).
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. Under **Custom domain**, type `wovencornwall.com` and **Save**. Do this *before* changing anything in Wix.

### 2. Point the domain at GitHub (in Wix)

In Wix: **Domains → ⋯ next to wovencornwall.com → Manage DNS Records**.

**A (Host)** section: add these four records with the host name left blank, then delete the old Wix A record (the one starting 185.230…):

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME (Aliases)** section: set the `www` record to point to `YOUR-GITHUB-USERNAME.github.io` (your username, no repository name).

**Leave everything else alone.** Don't touch the MX, TXT or any other records. Those run the zoe@wovencornwall.com email.

Click **Save Changes**. It can take anything from a few minutes to 48 hours to switch over.

### 3. Turn on the padlock

Back in **Settings → Pages** on GitHub, once the domain check shows a green tick, tick **Enforce HTTPS**.

## Changing things later

Ask Claude to make the change. Text lives in the `.html` page it appears on, colours and fonts in `styles.css`, and photos in `img/`.

## Going back to Wix

Delete the four GitHub A records in Wix, add back the Wix A record, and point `www` back to Wix. Nothing here is permanent.
