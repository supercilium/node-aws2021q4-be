create table products (
	id uuid primary key,
	title text,
	description text,
	price integer
);

/* CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; */

insert into products (id, title, description, price) values ('00284a51-43ba-4606-9e0e-1b83aff358a4', 'tsatska takaya', 'takaya klassnaya tsatska', '100500'), ('48f8abf8-ea87-4e49-8382-aa5bc39e6373', 'tsatska na sheuy', 'ochen krutaya, mamoj klyanus', '1000000'), ('a67e1c0b-46c8-4f6f-bae0-86f313a90a3b', 'ring of omnipotence', 'one ring to rule them all', '8');
