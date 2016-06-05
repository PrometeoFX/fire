BEGIN;

CREATE TABLE socialAccountInfo 
(
  uid integer NOT NULL,
  social_type text NOT NULL,
  social_id text NOT NULL,
  access_token text NOT NULL,
  refresh_token text DEFAULT '',
  PRIMARY KEY (uid,social_type)
);


COMMIT;


