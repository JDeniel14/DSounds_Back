const axios = require("axios");
const crypto = require("crypto");
const querystring = require("querystring");

const generateRandomString = (length) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect = "http://localhost:3003/api/DsoundsSpotify/CallbackSpotify";
const redirectAngular = "http://localhost:4200/MiCuenta";
const stateKey = "spotify_auth_state";

module.exports = {
  LoginSpotify: async (req, res, next) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = "user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private";

    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect,
          state: state,
        })
    );
  },

  CallbackSpotify: async (req, res, next) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state !== null && state === storedState) {
      res.clearCookie(stateKey);

      const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        data: querystring.stringify({
          code: code,
          redirect_uri: redirect,
          grant_type: "authorization_code",
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      };

      axios
        .post(authOptions.url, authOptions.data, { headers: authOptions.headers })
        .then((respuesta) => {
          if (respuesta.status === 200) {
            const access_token = respuesta.data.access_token;
            const refresh_token = respuesta.data.refresh_token;

            const options = {
              url: "http://api.spotify.com/v1/me",
              headers: { Authorization: "Bearer " + access_token },
            };

            axios
              .get(options.url, { headers: options.headers })
              .then((resp) => {
                console.log(resp.data);
              })
              .catch((error) => {
                console.log("Error al obtener los datos del perfil de spotify", error);
              });

            res.redirect(
              "http://localhost:4200/MiCuenta?" +
                querystring.stringify({
                  access_token: access_token,
                  refresh_token: refresh_token,
                })
            );
          } else {
            res.redirect(
              redirectAngular +
                "/?" +
                querystring.stringify({
                  error: "invalid_token",
                })
            );
          }
        })
        .catch((error) => {
          console.error('Error during token exchange:', error);
          res.status(500).send({ error: 'Error during token exchange' });
        });
    } else {
      res.status(400).send({ error: 'State mismatch or missing state' });
    }
  },

  GetRefreshToken: async (req, res, next) => {
    const refresh_token = req.query.refresh_token;
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      },
      data: querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token,
      }),
    };

    axios
      .post(authOptions.url, authOptions.data, { headers: authOptions.headers })
      .then((resp) => {
        if (resp.status === 200) {
          const access_token = resp.data.access_token;
          const new_refresh_token = resp.data.refresh_token;

          res.status(200).send({
            access_token: access_token,
            refresh_token: new_refresh_token,
          });
        }
      })
      .catch((error) => {
        console.error('Error refreshing token:', error);
        res.status(500).send({ error: 'Error refreshing token' });
      });
  },

  ObtenerPerfilSpotify: async (req, res, next) => {
    try {
      let { access_token } = req.query;

      axios
        .get('http://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${access_token}` } })
        .then((resp) => {
          if (resp.status === 200) {
            res.status(200).send({
              codigo: 0,
              mensaje: "Perfil de spotify recuperado correctamente",
              data: resp.data,
            });
          } else {
            throw new Error("Error al obtener el perfil de spotify del usuario");
          }
        })
        .catch((error) => {
          res.status(500).send({
            codigo: 1,
            mensaje: error.message,
            data: null,
          });
        });
    } catch (error) {
      res.status(500).send({
        codigo: 1,
        mensaje: error.message,
        data: null,
      });
    }
  },

  ObtenerPlaylistUsuario: async (req, res, next) => {
    try {
      let { access_token } = req.query;
      axios
        .get('https://api.spotify.com/v1/me/playlists?limit=15', { headers: { Authorization: `Bearer ${access_token}` } })
        .then((resp) => {
          if (resp.status === 200) {
            res.status(200).send({
              codigo: 0,
              mensaje: "Playlist del usuario de spotify recuperado correctamente",
              data: resp.data,
            });
          } else {
            throw new Error('Error al obtener las playlist del usuario actual');
          }
        })
        .catch((error) => {
          res.status(500).send({
            codigo: 1,
            mensaje: error.message,
            data: null,
          });
        });
    } catch (error) {
      res.status(500).send({
        codigo: 1,
        mensaje: error.message,
        data: null,
      });
    }
  },

  BuscarAlbumSpotify: async (req, res, next) => {
    try {
      let { access_token, nombreDisco } = req.body;

      axios
        .get(`https://api.spotify.com/v1/search?q=${nombreDisco}&type=album`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((resp) => {
          if (resp.status === 200) {
            res.status(200).send({
              codigo: 0,
              mensaje: "Album de spotify recuperado correctamente",
              data: resp.data,
            });
          } else {
            throw new Error("Error al obtener el album de spotify");
          }
        })
        .catch((error) => {
          res.status(500).send({
            codigo: 1,
            mensaje: error.message,
            data: null,
          });
        });
    } catch (error) {
      res.status(500).send({
        codigo: 1,
        mensaje: error.message,
        data: null,
      });
    }
  },

  AddDiscoToPlaylist: async (req, res, next) => {
    try {
      let { idPlaylist, idAlbum, access_token } = req.body;
      let tracksAlbum = [];

      axios
        .get(`https://api.spotify.com/v1/albums/${idAlbum}/tracks`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((resp) => {
          if (resp.status === 200) {
            tracksAlbum = resp.data.items;
            let tracksUris = tracksAlbum.map((track) => track.uri);

            axios
              .post(`https://api.spotify.com/v1/playlists/${idPlaylist}/tracks`, { uris: tracksUris }, { headers: { Authorization: `Bearer ${access_token}` } })
              .then((respAddPlaylist) => {
                if (respAddPlaylist.status === 200) {
                  res.status(200).send({
                    codigo: 0,
                    mensaje: "Disco agregado a la playlist correctamente",
                    data: respAddPlaylist.data,
                  });
                } else {
                  throw new Error("Error al agregar el disco a la playlist");
                }
              })
              .catch((error) => {
                res.status(500).send({
                  codigo: 1,
                  mensaje: error.message,
                  data: null,
                });
              });
          } else {
            throw new Error("Error al obtener los tracks del álbum");
          }
        })
        .catch((error) => {
          res.status(500).send({
            codigo: 1,
            mensaje: error.message,
            data: null,
          });
        });
    } catch (error) {
      res.status(500).send({
        codigo: 1,
        mensaje: error.message,
        data: null,
      });
    }
  },
};
