const request = require("request");
const getSpotifyToken = require("../util/getSpotifyToken");
const HTTPError = require("../util/http-error");

const getSongById = async (req, res, next) => {
  await getSpotifyToken();
  try {
    let options = {
      method: "GET",
      url: `https://api.spotify.com/v1/tracks/${req.params.id}`,
      headers: {
        Authorization: `Bearer ${process.env.SPOTIFY_TOKEN}`,
      },
      timeout: 5000,
      json: true,
    };
    request(options, (error, response) => {
      if (error) {
        return res
          .status(500)
          .json("Unknown Internal Error While Fetching Song");
      }
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).json(response.body);
      }
      let { name, duration_ms, id, external_urls, album, artists } =
        response.body;
      artists = artists.map(artist => {
        return { name: artist.name, url: artist.external_urls.spotify };
      });
      res.status(200).json({
        song: {
          name,
          duration_ms,
          id,
          url: external_urls.spotify,
          img: album.images,
          artists,
        },
      });
    });
  } catch (error) {
    next(
      new HTTPError(
        "Could not get the track due to internal server error",
        500,
        error
      )
    );
  }
};

const getSongsByPlaylistId = async (req, res, next) => {
  await getSpotifyToken();
  try {
    let options = {
      method: "GET",
      url: `https://api.spotify.com/v1/playlists/${req.params.id}`,
      headers: {
        Authorization: `Bearer ${process.env.SPOTIFY_TOKEN}`,
      },
      timeout: 5000,
      json: true,
    };
    request(options, (error, response) => {
      if (error) {
        return res
          .status(500)
          .json("Unknown Internal Error While Fetching Song");
      }
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).json(response.body);
      }

      let { name, description, images, owner, id, external_urls, tracks } =
        response.body;
      tracks = tracks.items.map(track => {
        let { name, duration_ms, id, external_urls, album, artists } =
          track.track;
        artists = artists.map(artist => {
          return { name: artist.name, url: artist.external_urls.spotify };
        });
        return {
          name,
          duration_ms,
          id,
          url: external_urls.spotify,
          img: album.images,
          artists,
        };
      });
      res.status(200).json({
        playlist: {
          name,
          description,
          images,
          id,
          url: external_urls.spotify,
          tracks,
          owner: {
            display_name: owner.display_name,
            url: owner.external_urls.spotify,
            id: owner.id,
          },
        },
      });
    });
  } catch (error) {
    next(
      new HTTPError(
        "Could not get playlist due to internal server error",
        500,
        error
      )
    );
  }
};

module.exports = { getSongById, getSongsByPlaylistId };
