function finishOAuth(){
    storedTokenDatalinnk = localStorage.getItem('linkTokenData')
    // linkTokenData = JSON.parse(storedTokenData)
    alert(storedTokenDatalinnk)
    const handler = Plaid.create({
        // token: linkTokenData.link_token,
        token: storedTokenDatalinnk,
        receivedRedirectUri: window.location.href,
        onSuccess: async (publicToken, metadata) => {
          console.log(
            `I have a public token: ${publicToken} I should exchange this`
          );


          alert(publicToken)
          // await exchangeToken(publicToken);
        },
        onExit: (err, metadata) => {
          console.log(
            `I'm all done. Error: ${JSON.stringify(err)} Metadata: ${JSON.stringify(
              metadata
            )}`
          );
          
          if(err!=null){
            window.location.href='/sales/application'
          }

        },
        onEvent: (eventName, metadata) => {
          console.log(`Event ${eventName}`);
        },
      });
      handler.open();
}



// async function exchangeToken(publicToken) {
//     const tokenExchangeResponse = await fetch(`/api/exchange_public_token`, {
//       method: "POST",
//       headers: { "Content-type": "application/json" },
//       body: JSON.stringify({ public_token: publicToken }),
//     });
//     const tokenExchangeData = await tokenExchangeResponse.json();
//     console.log("Done exchanging our token");
//     window.location.href = "index.html";
//   }
  
  finishOAuth()