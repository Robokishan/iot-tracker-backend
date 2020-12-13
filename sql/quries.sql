

1. 
SELECT tt.*
FROM asset_data tt
INNER JOIN
    (SELECT asset_id, MAX(payload_id) as PAYID, MAX(added_on) AS MaxDateTime
    FROM asset_data 
    GROUP BY asset_id) groupedtt 
ON tt.asset_id = groupedtt.asset_id 
AND tt.added_on = groupedtt.MaxDateTime
AND tt.payload_id=groupedtt.PAYID
where tt.asset_id in (
select assets.asset_id from owners inner join asset_permission on asset_permission.owner_id=owners.owner_id inner join assets on assets.asset_id=asset_permission.asset_id where asset_permission.owner_id='4beca0d0-3f94-11ea-973c-2fffdd224480'
);


2.
select assets.asset_id, owners.owner_id, owners.user_name, assets.asset_name from owners inner join asset_permission on asset_permission.owner_id=owners.owner_id inner join assets on assets.asset_id=asset_permission.asset_id where asset_permission.owner_id='4beca0d0-3f94-11ea-973c-2fffdd224480';


  added_on  | modified_on |                   payload                    |               asset_id               | payload_id 
------------+-------------+----------------------------------------------+--------------------------------------+------------
 1580150716 |  1580150716 | {"temp":21.44,"hum":73,"lat":21.01,"lon":25} | b6c1ac50-4126-11ea-aa76-6f73816bcde7 |         23
 1580324351 |  1580324351 | {"temp":23.44,"hum":73,"lat":23.01,"lon":25} | b3b8a780-4125-11ea-977c-0146afdde05c |         29
 1580326300 |  1580326300 | {"temp":23.44,"hum":73,"lat":23.01,"lon":25} | 7aae65c0-42cd-11ea-87c7-276ad48801e0 |         38
 1580326322 |  1580326322 | {"temp":23.44,"hum":73,"lat":23.01,"lon":25} | 8f6126f0-42c9-11ea-8a5e-059c7fdd2f20 |         46
 1580327332 |  1580327332 | {"temp":23.44,"hum":73,"lat":23.01,"lon":25} | b2cfbd40-42c9-11ea-8a5e-059c7fdd2f20 |         61
 1580327764 |  1580327764 | {"temp":23.44,"hum":73,"lat":23.01,"lon":25} | c2cdeea0-4126-11ea-aa76-6f73816bcde7 |        161
 1580327840 |  1580327840 | {"temp":23.44,"hum":73,"lat":23.01,"lon":25} | d799c810-42cd-11ea-87c7-276ad48801e0 |        211

 1580150716 |  1580150716 | {"temp":21.44,"hum":73,"lat":21.01,"lon":25} | b6c1ac50-4126-11ea-aa76-6f73816bcde7 |         23
 1580324351 |  1580324351 | {"temp":23.44,"hum":73,"lat":23.01,"lon":25} | b3b8a780-4125-11ea-977c-0146afdde05c |         29
 1580326300 |  1580326300 | {"temp":23.44,"hum":73,"lat":23.01,"lon":25} | 7aae65c0-42cd-11ea-87c7-276ad48801e0 |         38
 1580326322 |  1580326322 | {"temp":23.44,"hum":73,"lat":23.01,"lon":25} | 8f6126f0-42c9-11ea-8a5e-059c7fdd2f20 |         46
 1580327332 |  1580327332 | {"temp":23.44,"hum":73,"lat":23.01,"lon":25} | b2cfbd40-42c9-11ea-8a5e-059c7fdd2f20 |         61
 1580327764 |  1580327764 | {"temp":23.44,"hum":73,"lat":23.01,"lon":25} | c2cdeea0-4126-11ea-aa76-6f73816bcde7 |        161
 1580327840 |  1580327840 | {"temp":23.44,"hum":73,"lat":23.01,"lon":25} | d799c810-42cd-11ea-87c7-276ad48801e0 |        211



   added_on  | modified_on |                   payload                    |               asset_id               | payload_id 
------------+-------------+----------------------------------------------+--------------------------------------+------------
 1580150716 |  1580150716 | {"temp":21.44,"hum":73,"lat":21.01,"lon":25} | b6c1ac50-4126-11ea-aa76-6f73816bcde7 |         23


23,29,38,46,61,161,211