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
  /**
   *
   * @param {Request} req
   * @param {Response} res
   */
  LoginSpotify: async (req, res, next) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope =
      "user-read-private user-read-email playlist-modify-public playlist-modify-private";

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

  /**
   *
   * @param {Request} req
   * @param {Response} res
   */
  CallbackSpotify: async (req, res, next) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state !== null || state === storedState) {
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
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      };

      axios
        .post(authOptions.url, authOptions.data, {
          headers: authOptions.headers,
        })
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
                console.log(respuesta.data);
              })
              .catch((error) => {
                console.log(
                  "Error al obtener los datos del perfil de spotify",
                  error
                );
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
        });
    }
  },

  GetRefreshToken: async(req,res, next)=>{
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

    axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers } ).then(
        (resp)=>{
            if(resp.status === 200){
                const access_token = response.data.access_token;
            const refresh_token = response.data.refresh_token;
            
              res.status(200).send(
                {
                  access_token: access_token,
                  refresh_token: refresh_token,
                }
              )
                    
            }
        }
    ).catch((error) => {
        console.error('Error refreshing token:', error);
        return error;
      });
  },

  ObtenerPerfilSpotify: async(req,res,next)=>{
    try {
      let {access_token} = req.query;

      let resp = await axios.get('http://api.spotify.com/v1/me',{headers:{'Authorization':`Bearer ${access_token}`}})

      if(resp.status === 200){
        return resp.data;
      }else{
        throw new Error("Error al obtener el perfil de spotify del usuario")
      }
    } catch (error) {
      res.status(500).send(
        {
          error:error
        }
      )
    }
  }


};
