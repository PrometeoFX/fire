BEGIN;

CREATE TABLE sharingLinks
(
  linkID text NOT NULL,
  uid integer NOT NULL,
  filename text NOT NULL,
  filepath text NOT NULL,
  password text,
  ExpDate bigint,
  AvailDate bigint NOT NULL,
  tmp_username text DEFAULT '', 
  tmp_linkStatus text DEFAULT '',
  isFolder boolean DEFAULT 0,
  sharing_list text DEFAULT '',
  valid_times integer DEFAULT -1,
  PRIMARY KEY (linkID)
);

COMMIT;


