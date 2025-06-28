import nacl from 'tweetnacl';

describe('NACL Mock Debug', () => {
  it('should load nacl mock correctly', () => {
    console.log('NACL object:', nacl);
    console.log('NACL secretbox:', nacl?.secretbox);
    console.log('NACL secretbox.nonceLength:', nacl?.secretbox?.nonceLength);
    
    expect(nacl).toBeDefined();
    expect(nacl.secretbox).toBeDefined();
    expect(nacl.secretbox.nonceLength).toBe(24);
  });
}); 