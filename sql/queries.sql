-- 1. already added or not -> then and then entry
-- 2. select all the devices for specific user
-- 3. check the permission for specific user and then get the data.

-- LEVELS OF PERMISSION
-- 1. ADMIN LEVEL PERMISSION RWD
-- 2. OWNER LEVEL PERMISSION RWD
-- 3. EMPLOYEE LEVEL PERMISSION RW
-- 4. ASSET LEVEL PERMISSION R DATA
-- 5. MINOR LEVEL PERMISSION R DEVICE LIST

-- registration of device
insert into assets (asset_name, asset_type, added_on, address, bookmark, asset_id) values
('kitchen wifi','wifi', CURRENT_TIMESTAMP, '{"address":"hello world"}', '{"bootmark":"samplebookmark"}', 'c2cdeea0-4126-11ea-aa76-6f73816bcde7')

-- data insert query
insert into asset_data (added_on, modified_on, payload, asset_id)
values(123345, 12341324, '{"payload":"sample payload"}','b3b8a780-4125-11ea-977c-0146afdde05c')


-- for geting device all permission details
SELECT asset_permission.asset_id, owners.owner_id
FROM asset_permission
FULL JOIN owners ON asset_permission.owner_id=owners.owner_id where asset_permission.asset_id = 'b3b8a780-4125-11ea-977c-0146afdde05c' ;

-- for getting user all permission details
SELECT asset_permission.asset_id, owners.owner_id
FROM asset_permission
full JOIN owners ON asset_permission.owner_id=owners.owner_id where asset_permission.owner_id = '4beca0d0-3f94-11ea-973c-2fffdd224480' ;

-- insert devices if and only if not exist in asset_permission table
INSERT INTO asset_permission (asset_id, owner_id)
SELECT * FROM (SELECT '8b966230-41eb-11ea-a1bc-cf76abc5b958', '916d2270-41eb-11ea-a1bc-cf76abc5b958') AS tmp
WHERE NOT EXISTS (
    SELECT asset_permission.asset_id, owners.owner_id
    FROM asset_permission
    INNER JOIN owners ON asset_permission.owner_id=owners.owner_id where asset_permission.asset_id = '8b966230-41eb-11ea-a1bc-cf76abc5b958' ;
) LIMIT 1;

-- postgresql query for same above
INSERT INTO asset_permission
    (level,asset_id, owner_id)
SELECT 1,'8b966230-41eb-11ea-a1bc-cf76abc5b958', '916d2270-41eb-11ea-a1bc-cf76abc5b958'
WHERE
    NOT EXISTS (
        SELECT asset_permission.asset_id, owners.owner_id
        FROM asset_permission
        INNER JOIN owners ON asset_permission.owner_id=owners.owner_id where asset_permission.asset_id = '8b966230-41eb-11ea-a1bc-cf76abc5b958'
    );

-- production 1.1
INSERT INTO asset_permission
    (level,asset_id, owner_id)
select 1, (select asset_id from assets where asset_username='toradex11') , '031b9210-46a8-11ea-b690-29545f6848ad' 
WHERE
    NOT EXISTS (
        SELECT asset_permission.asset_id, owners.owner_id,assets.asset_username
        FROM asset_permission
        INNER JOIN owners ON asset_permission.owner_id=owners.owner_id
		INNER JOIN assets ON asset_permission.asset_id=assets.asset_id
		where assets.asset_username = 'toradex11'
    );

-- postgresql query for getting data from permission table and owners and assets
SELECT * FROM asset_data a, asset_permission p 
WHERE p.owner_id = '4beca0d0-3f94-11ea-973c-2fffdd224480' AND LEVEL = 1 AND EXISTS 
( SELECT '1' FROM assets b WHERE a.asset_id = b.asset_id) AND p.asset_id = 'b6c1ac50-4126-11ea-aa76-6f73816bcde7'

-- sample example for three table join
-- https://stackoverflow.com/questions/18081182/select-query-from-3-tables-with-foreign-keys
-- select w.* from Winner w
-- left Join Player p on p.ID_player = w.player_FK
-- left join Game g on g.ID_game = p.Game_FK
-- where  Game.ID_game = 2

-- if not exist code
-- https://stackoverflow.com/questions/20971680/sql-server-insert-if-not-exist
-- BEGIN
--    IF NOT EXISTS (SELECT * FROM EmailsRecebidos 
--                    WHERE De = @_DE
--                    AND Assunto = @_ASSUNTO
--                    AND Data = @_DATA)
--    BEGIN
--        INSERT INTO EmailsRecebidos (De, Assunto, Data)
--        VALUES (@_DE, @_ASSUNTO, @_DATA)
--    END
-- END


-- overview api
SELECT * FROM asset_data WHERE added_on >= 1580307422 and added_on <= 1580327240 and asset_id='b3b8a780-4125-11ea-977c-0146afdde05c' order by added_on desc

b3b8a780-4125-11ea-977c-0146afdde05c
b6c1ac50-4126-11ea-aa76-6f73816bcde7
c2cdeea0-4126-11ea-aa76-6f73816bcde7

owners:
4beca0d0-3f94-11ea-973c-2fffdd224480

-- paginatio expriments
SELECT *
    FROM items
    LIMIT {itemsPerPage} OFFSET {(page - 1) * itemsPerPage}

"SELECT *FROM OZ_RAW_LOGGER WHERE DATA_D_T BETWEEN "+gte+" AND "+lte+" AND DEVICEID = '"+req.params.deviceId+"' ORDER BY DATA_D_T DESC LIMIT "+(limit*page)+", "+limit+";";

select * from asset_data where added_on between 1580327738 and 1580327764 and asset_id = 'c2cdeea0-4126-11ea-aa76-6f73816bcde7' ORDER BY added_on desc limit 11, 10;



-- pagination producion query 1.0
SELECT *, count(*) OVER() AS total_data
FROM   asset_data
WHERE  added_on between 1580327738 and 1580327764 and asset_id = 'c2cdeea0-4126-11ea-aa76-6f73816bcde7'
ORDER  BY added_on
LIMIT  25
OFFSET 49 --887ms

-- pagiation production query 1.1
SELECT *, count(*) OVER() AS total_data
FROM   asset_data
WHERE  added_on between 1580327738 and 1580327764 and asset_id = 'c2cdeea0-4126-11ea-aa76-6f73816bcde7' and added_on > 1580327755 
ORDER  BY added_on
FETCH FIRST 25 ROW ONLY --882ms


-- current production very slow efficeny required
SELECT *, count(*) OVER() AS total_data
FROM   asset_data
WHERE  added_on between 1580327738 and 1580327764 and asset_id = 'c2cdeea0-4126-11ea-aa76-6f73816bcde7'
ORDER  BY payload_id asc 
limit 25
offset 25




-- overview api
SELECT *, count(*) OVER() AS total_data FROM asset_data inner join asset_permission on asset_permission.asset_id=asset_data.asset_id inner join assets on asset_data.asset_id=assets.asset_id WHERE asset_data.added_on between ${gte} and ${lte} and asset_permission.asset_id = '${asset_id}' and asset_permission.owner_id='${userId}' ORDER  BY payload_id asc  limit ${limit} offset ${page}

-- https://www.youtube.com/watch?v=G1OLrfjHDyw
-- https://www.youtube.com/watch?v=FPqXPkQkMP0

SELECT
FROM
    asset_data a
        USING asset_data b
WHERE
    a.payload_id < b.payload_id
    AND a.asset_id = b.asset_id;

-- prudction asset id
SELECT tt.asset_id, tt.added_on, tt.payload, tt.payload_id, assets.asset_name, assets.asset_type
FROM asset_data tt
INNER JOIN
    (SELECT asset_id, MAX(payload_id) AS PAYID, MAX(added_on) AS MaxDateTime
    FROM asset_data 
    GROUP BY asset_id) groupedtt 
ON tt.asset_id = groupedtt.asset_id 
AND tt.added_on = groupedtt.MaxDateTime
AND tt.payload_id=groupedtt.PAYID
INNER JOIN assets ON tt.asset_id = assets.asset_id
WHERE tt.asset_id IN (
	SELECT assets.asset_id FROM owners INNER JOIN asset_permission ON asset_permission.owner_id=owners.owner_id INNER JOIN assets ON assets.asset_id=asset_permission.asset_id WHERE asset_permission.owner_id='4beca0d0-3f94-11ea-973c-2fffdd224480'
);