select * from assets where exists(
	select 1 from owners where owner_id = '4beca0d0-3f94-11ea-973c-2fffdd224480' and type = 1
)



-- get total number of devices per user
-- https://stackoverflow.com/questions/54966631/sql-query-to-retrieve-total-order-count-for-each-user
select owner_name, user_name, owner_id,
       (select count(*) from asset_permission od where  od.owner_id =c.owner_id) totalasset
from owners c