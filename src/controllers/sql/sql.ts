// Sql queries to be passed into the controllers

// all of the queries do what the name suggests
// + concat adds the base url to the image names

export const list = `SELECT *,
CONCAT($1 :: VARCHAR,cover) AS cover,
CONCAT($1,thumbnail) AS thumbnail
FROM images OFFSET $2 LIMIT $3;`;

export const retrieve = `SELECT *,
CONCAT($1 :: VARCHAR,cover) AS cover,
CONCAT($1,thumbnail) AS thumbnail
FROM images WHERE id = $2;`;

export const create = `INSERT INTO images(id, cover, thumbnail) 
VALUES ($1, $2, $3) RETURNING *, 
CONCAT($4 :: VARCHAR,cover) AS cover,
CONCAT($4,thumbnail) AS thumbnail;`;

export const update = `UPDATE images SET cover = $1, thumbnail = $2 
WHERE id = $3 RETURNING *, 
CONCAT($4 :: VARCHAR,cover) AS cover,
CONCAT($4,thumbnail) AS thumbnail;`;

export const destroy = `DELETE FROM images WHERE id = $1;`;

// Checks if the image exists
export const check = `SELECT * FROM images WHERE id = $1;`;
