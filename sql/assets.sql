-- Table: public.assets

-- DROP TABLE public.assets;

CREATE TABLE public.assets
(
    asset_name character varying(200) COLLATE pg_catalog."default" NOT NULL,
    asset_type character varying(200) COLLATE pg_catalog."default" NOT NULL,
    added_on timestamp without time zone NOT NULL,
    address json,
    bookmark json,
    asset_id uuid NOT NULL,
    id integer NOT NULL DEFAULT nextval('assets_id_seq'::regclass),
    CONSTRAINT assets_pkey PRIMARY KEY (asset_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.assets
    OWNER to nzwmcgat;