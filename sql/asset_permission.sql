-- Table: public.asset_permission

-- DROP TABLE public.asset_permission;

CREATE TABLE public.asset_permission
(
    level integer NOT NULL,
    permission_id integer NOT NULL DEFAULT nextval('permission_permission_seq'::regclass),
    owner_id uuid NOT NULL,
    asset_id uuid NOT NULL,
    CONSTRAINT permission_pkey PRIMARY KEY (permission_id),
    CONSTRAINT "ASSET_ID" FOREIGN KEY (asset_id)
        REFERENCES public.assets (asset_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT "OWNER_ID" FOREIGN KEY (owner_id)
        REFERENCES public.owners (owner_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.asset_permission
    OWNER to nzwmcgat;