INSERT INTO
  users (id, email, name, password)
VALUES
  (
    1,
    'pantalone@fatui.or.ru',
    'Pantalone',
    '$2b$10$gBMvc.MsuGBS62DaueHcYuXhTi/7SVuODjYcrqHi/BX1EIK2WBNwu'
  ),
  (
    2,
    'dottore@fatui.or.ru',
    'Zandik',
    '$2b$10$spu6lQnz0vvmYZ7eu40tfO2XC6ihRVeaSr6lfHc3JeIHGN68DKSKi'
  ),
  (
    3,
    'defalt@malicious.co',
    'DefalT_HacK',
    '$2b$10$gXcjh3U.PJNacfDXR68UReTlo812O9ni0Iu0nxiP80TWrh/gvgjBa'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO
  accounts (id, user_id, account_number, balance)
VALUES
  (1, 1, '1234567887654321', 982321342),
  (2, 2, '8765432112345678', 1021000),
  (3, 3, '1212343445455656', 0)
ON CONFLICT (id) DO NOTHING;
