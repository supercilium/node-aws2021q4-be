create table stocks (
	product_id uuid references products(id),
	count integer
);

insert into stocks (product_id, count) values ('00284a51-43ba-4606-9e0e-1b83aff358a4', 5), ('48f8abf8-ea87-4e49-8382-aa5bc39e6373', 10), ('a67e1c0b-46c8-4f6f-bae0-86f313a90a3b', 1);
