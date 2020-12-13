-- Table: public.asset_data

-- DROP TABLE public.asset_data;

CREATE TABLE public.asset_data
(
    added_on bigint NOT NULL,
    modified_on bigint NOT NULL,
    payload json NOT NULL,
    asset_id uuid NOT NULL,
    payload_id integer NOT NULL DEFAULT nextval('asset_data_payid_seq'::regclass),
    CONSTRAINT asset_id FOREIGN KEY (asset_id)
        REFERENCES public.assets (asset_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.asset_data
    OWNER to nzwmcgat;