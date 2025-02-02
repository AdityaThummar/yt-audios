const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = 3000;

// Endpoint to get audio URL
app.get('/get-audio-url', async (req, res) => {
  const videoUrl = req.query.url;
  console.log("videoUrlvideoUrl", videoUrl)

  if (!videoUrl) {
    return res.status(400).json({ error: 'Please provide a YouTube video URL.' });
  }

  try {
    // Validate the YouTube URL
    if (!ytdl.validateURL(videoUrl)) {
      return res.status(400).json({ error: 'Invalid YouTube URL.' });
    }

    // Get video info
    const info = await ytdl.getInfo(videoUrl, {lang:"en"});
    console.log("infoinfo", info)

    // Filter formats to get audio-only streams
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

    if (audioFormats.length === 0) {
      return res.status(404).json({ error: 'No audio formats found for this video.' });
    }

    // Select the first audio format (you can customize this logic)
    const audioUrl = audioFormats[0].url;
    // const audioUrl = ''

    // Return the audio URL
    res.json({ audioUrl });
  } catch (error) {
    console.error('Error fetching audio URL:', error);
    res.status(500).json({ error: 'An error occurred while fetching the audio URL.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});