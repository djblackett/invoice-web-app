CREATE TABLE IF NOT EXISTS invoices_dev (
    id varchar not null primary key,
    created_at varchar not null,
    payment_due varchar,
    description varchar,
    payment_terms integer,
    client_name varchar,
    client_email varchar,
    status varchar,
    sender_street varchar,
    sender_city varchar,
    sender_postcode varchar,
    sender_country varchar,
    client_street varchar,
    client_city varchar,
    client_postcode varchar,
    client_country varchar
)