const appendRevision = require('./src/append-revision');

test('it appends url & package & revision when non present', () => {
  const body = 'My Description';
  const url = 'https://myapp.com';
  const packageName = 'test_package'
  const revision = '1234567';

  const results = appendRevision(body, url, packageName, revision);
  const expectedResults = `${body}\n\n --- \n\n[${packageName}_revision=${revision}](${url}?${packageName}_revision=${revision})`;

  expect(results).toMatch(expectedResults);
});

test('it replaces existing package with latest revision', () => {
  const packageName = 'existing_package';
  const revision = 'abcd123';
  const url = 'https://myapp.com';
  const body = `My Description \n\n --- \n\n`;

  const results = appendRevision(body, url, packageName, revision);
  const expectedResults = `${body}\n\n --- \n\n[${packageName}_revision=${revision}](${url}?${packageName}_revision=${revision})`;

  expect(results).toMatch(expectedResults);
});

test('it replaces only existing packages revision with multiple package try links', () => {
  const packageName = 'existing';
  const revision = 'abcd123';
  const url = 'https://myapp.com';
  const body = `My Description \n\n --- \n\n [do_not_edit_revision=12345ab](${url}?do_not_edit_revision=12345ab)\n[${packageName}_revision=12345ab](${url}?${packageName}_revision=12345ab)`;

  const results = appendRevision(body, url, packageName, revision);

  const expectedResults = `My Description \n\n --- \n\n [do_not_edit_revision=12345ab](${url}?do_not_edit_revision=12345ab)\n[${packageName}_revision=${revision}](${url}?${packageName}_revision=${revision})`;

  expect(results).toMatch(expectedResults);
});

test('it appends new try link after other package links', () => {
  const packageName = 'existing';
  const revision = 'abcd123';
  const url = 'https://myapp.com';
  const body = `My Description \n\n --- \n\n [do_not_edit_revision=12345ab](${url}?do_not_edit_revision=12345ab)`;

  const results = appendRevision(body, url, packageName, revision);

  const expectedResults = `My Description \n\n --- \n\n [do_not_edit_revision=12345ab](${url}?do_not_edit_revision=12345ab)\n[${packageName}_revision=${revision}](${url}?${packageName}_revision=${revision})`;

  expect(results).toMatch(expectedResults);
});