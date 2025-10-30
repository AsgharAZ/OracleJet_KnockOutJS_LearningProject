CREATE OR REPLACE PROCEDURE sp_create_account(
    p_cnic BIGINT,                -- CNIC → customer.id
    p_account_number BIGINT,      -- account.account_number
    p_username VARCHAR(255),      -- customer.username
    p_password VARCHAR(255),      -- customer.password (hashed in app)
    p_name VARCHAR(255) DEFAULT NULL,
    p_phone_number VARCHAR(13) DEFAULT NULL,
    p_account_type INTEGER DEFAULT 1,
    p_iban VARCHAR(34) DEFAULT NULL,
    p_digitally_active BOOLEAN DEFAULT true
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_customer_exists BOOLEAN;
    v_account_exists BOOLEAN;
BEGIN
    -- Validate input
    IF p_cnic IS NULL OR p_cnic < 1000000000000 OR p_cnic > 9999999999999 THEN
        RAISE EXCEPTION 'Invalid CNIC: must be 13 digits.';
    END IF;

    IF p_account_number IS NULL OR p_account_number < 10000000000000 OR p_account_number > 99999999999999 THEN
        RAISE EXCEPTION 'Invalid account number: must be 14 digits.';
    END IF;

    IF p_username IS NULL OR trim(p_username) = '' THEN
        RAISE EXCEPTION 'Username cannot be null or empty.';
    END IF;

    IF p_password IS NULL OR trim(p_password) = '' THEN
        RAISE EXCEPTION 'Password cannot be null or empty.';
    END IF;

    -- Check existing records
    SELECT EXISTS(SELECT 1 FROM customer WHERE id = p_cnic)
    INTO v_customer_exists;

    IF v_customer_exists THEN
        RAISE EXCEPTION 'Customer with CNIC % already exists.', p_cnic;
    END IF;

    SELECT EXISTS(SELECT 1 FROM accounts WHERE account_number = p_account_number)
    INTO v_account_exists;

    IF v_account_exists THEN
        RAISE EXCEPTION 'Account number % already exists.', p_account_number;
    END IF;

    -- Insert into customer table
    INSERT INTO customer (id, name, password, "phone number", username)
    VALUES (p_cnic, COALESCE(p_name, 'Customer_' || p_cnic), p_password,
            COALESCE(p_phone_number, '+923000000000'), p_username);

    -- Insert into accounts table
    INSERT INTO accounts (account_number, account_type, digitally_active, iban, user_id)
    VALUES (p_account_number, p_account_type, p_digitally_active,
            COALESCE(p_iban, 'PK36HABB000000000000' || right(p_account_number::text, 7)),
            p_cnic);

    RAISE NOTICE '✅ Account created successfully for customer CNIC: %', p_cnic;
END;
$$;
