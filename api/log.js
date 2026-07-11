// A simple local memory cache to keep track of recent IP hits
const localRequestHistory = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const GOOGLE_URL = process.env.APPS_SCRIPT_URL;
    const SECRET_TOKEN = process.env.VISIT_LOG_TOKEN;

    let bodyData = req.body;
    if (typeof bodyData === 'string') {
      bodyData = JSON.parse(bodyData);
    }

    const { path, ua, referrer, lang, tz, screen, viewport } = bodyData;

    const rawIp = req.headers['x-vercel-forwarded-for'] || req.headers['x-real-ip'] || 'Unknown';
    const userIp = rawIp.split(',')[0].trim();

    const now = Date.now();
    if (localRequestHistory.has(userIp)) {
      const lastVisitTime = localRequestHistory.get(userIp);
      
      // If this specific verified IP hits the API again in less than 5 seconds, reject it!
      if (now - lastVisitTime < 5000) {
        return res.status(429).json({ error: 'Too many requests. Slow down!' });
      }
    }

    localRequestHistory.set(userIp, now);

    if (localRequestHistory.size > 1000) {
      localRequestHistory.clear();
    }

    // Geo Lkup
    let geo = { country: 'Unknown', region: 'Unknown', city: 'Unknown' };
    try {
      if (userIp && userIp !== 'Unknown') {
        const geoRes = await fetch(`http://ip-api.com/json/${userIp}?fields=status,country,regionName,city`);
        const geoData = await geoRes.json();
        if (geoData.status === 'success') {
          geo = {
            country: geoData.country || 'Unknown',
            region: geoData.regionName || 'Unknown',
            city: geoData.city || 'Unknown'
          };
        }
      }
    } catch (geoError){
      // fail silently
    }

    const googleResponse = await fetch(GOOGLE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: SECRET_TOKEN,
        path: path || '/',
        ua: ua || 'Unknown',
        ip: userIp,
        referrer: referrer || 'direct',
        lang: lang || 'Unknown',
        tz: tz || 'Unknown',
        screen: screen || "Unknown",
        viewport: viewport || 'Unknown',
        country: geo.country,
        region: geo.region,
        city: geo.city
      })
    });

    const resultText = await googleResponse.text();
    return res.status(200).send(resultText);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}