-- Table: public.owners

-- DROP TABLE public.owners;

CREATE TABLE public.owners
(
    user_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    password character varying(300) COLLATE pg_catalog."default",
    email character varying(50) COLLATE pg_catalog."default" NOT NULL,
    id integer NOT NULL DEFAULT nextval('owner_id_seq'::regclass),
    owner_name character varying(100) COLLATE pg_catalog."default",
    last_change bigint,
    address json NOT NULL,
    owner_details json NOT NULL,
    owner_id uuid NOT NULL,
    created_on bigint NOT NULL,
    type integer,
    CONSTRAINT owner_pkey PRIMARY KEY (owner_id),
    CONSTRAINT user_name UNIQUE (user_name),
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_user_name_key UNIQUE (user_name)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.owners
    OWNER to nzwmcgat;


-- https://stackoverflow.com/questions/4342370/grouping-into-interval-of-5-minutes-within-a-time-range
-- for date wise data count 
-- all
select count(*),assets.asset_username,asset_data.asset_id,to_timestamp(cast(asset_data.added_on as bigint))::date time_stamp from asset_data inner join assets on asset_data.asset_id=assets.asset_id group by asset_data.asset_id,assets.asset_username,time_stamp
-- specific asset_id
select count(*),assets.asset_username,asset_data.asset_id,to_timestamp(cast(asset_data.added_on as bigint))::date time_stamp from asset_data inner join assets on asset_data.asset_id=assets.asset_id where assets.asset_id='5ed3e480-63a5-11ea-aa46-5f0ad4565e9f' group by asset_data.asset_id,assets.asset_username,time_stamp
-- specific owner_id
select count(*),assets.asset_username,asset_data.asset_id,to_timestamp(cast(asset_data.added_on as bigint))::date time_stamp from asset_data inner join assets on asset_data.asset_id=assets.asset_id inner join asset_permission on asset_data.asset_id=asset_permission.asset_id where asset_permission.owner_id='ff4b9030-63a4-11ea-aa46-5f0ad4565e9f' and group by asset_data.asset_id,assets.asset_username,time_stamp


SELECT *
    FROM asset_data
    order by added_on desc
    LIMIT {itemsPerPage} OFFSET {(page - 1) * itemsPerPage}
    
    
    SELECT *
    FROM asset_data
	order by added_on desc
    limit 10 OFFSET ((1 - 1) * 10) 
