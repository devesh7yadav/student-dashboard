import jwt from "jsonwebtoken";

function jwtTokens({id, email}) {
    const user = {id, email};

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1m'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'50m'});

    return {accessToken, refreshToken}
}

export {jwtTokens}