curl --request POST \
     --url https://api.verbwire.com/v1/nft/mint/quickMintFromMetadataUrl \
     --header 'X-API-Key:{insert your API Key here} ' \
     --header 'accept: application/json' \
     --header 'content-type: multipart/form-data' \
     --form allowPlatformToOperateToken=true \
     --form chain=sepolia \
     --form recipientAddress={insert your wallet address here in order to mint} \
     --form metadataUrl=https://ipfs.io/ipfs/bafkreigjkcafrutdcbicyr3new6aoowgbscf6wgqyty45ckd3xur7ymldm #sample metadata of nft from ipfs given by verbwire
