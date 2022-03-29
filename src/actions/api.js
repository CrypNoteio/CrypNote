
export const baseURL = "";
const baseurl = "";
export const imgBaseURL = "";

//Main
export const createnft = "";

export const pageSize = 10;
export const sign = baseurl
export const login = baseurl

//0 registration 1 forget password 2 revision mailbox 3 invitation code 4 delete knowledge base
export const getemialvcode = baseurl
export const checkemialvcode = baseurl
export const forget = baseurl
//Home page
export  const getlibList = baseurl
export const newcreatelib = baseurl
export const artcleList = baseurl

//New WORD
export const saveArticle = baseurl
//word
export const getarticle = baseurl
//Modify word
export const updatearticle = baseurl
//Delete a file
export const delarticle = baseurl
//Undo deletion
export const rollbackticle = baseurl
//Completely deleted
export const realdel = baseurl
//Show modified personal information
export const getcustomer = baseurl
export const updateinfo = baseurl
//Get personal information (personal home page)
export const getCustomerInfo = baseurl
//New Quill
export const saveWiki = baseurl
//Modify Quill
export const updateWiki = baseurl
//Delete Quill
export const delWiki = baseurl
//Get Quill
export const getWiki = baseurl
//Get Quill list
export const wikiList = baseurl
//Collect Quill
export const collectQuill = baseurl
//Uncollect Quill
export const delCollectQuill = baseurl
//Get favorites Quill list
export const getCollectQuills = baseurl
//token list
export const getCoinList = baseurl
//follow&unfollow token
export const attention = baseurl
//followed token list
export const attentionList = baseurl
//Get a list of hot topics
export const recommendtopics = baseurl
//Get a single token information
export const getCoinInfo = baseurl
//Pay attention to users
export const followAuthor = baseurl
//Delete encyclopedia articles
export const delwiki = baseurl
//Bind a custom secondary domain name
export const savedefinedurl = baseurl
/**
 * wallet
 * api:savewallet  
 * parmas(apptoken,walletAddress)
 */
export const savewallet = baseurl
// Modify the avatar
export const fileImg = baseurl
//Add and delete favorites list
export const collect = baseurl
export const delcollect = baseurl
export const collectlist = baseurl
//Browse record
export const recentlylist = baseurl

//Upper chain
export const syncchain = baseurl

//Recycling bin
export const gettrash = baseurl
//Modify the mobile phone number
export const customerPhone = baseurl
//Modify the password
export const customerPwd = baseurl
//Modify email address
export const customerEmail = baseurl
//Create an invitation code
export const createInvtieCode = baseurl
//List of versions of the article
export const getRecord =baseurl
//Get decrypted document
export const getDetail = baseurl
//Picture upload
export const imageUp = baseurl
/**
 * message center
 * api:sysmsgcount  
 * parmas(apptoken)
 * response(total personal team noteverse)
 */
export const sysmsgcount = baseurl
/**
 * filter message
 * api:sysmsg  
 * parmas(apptoken,messageType（0：personal  1：team 2：noteverse）type(0add 1edit 2delete 3Restore 4onchain,null all))
 */
export const sysmsg = baseurl
 
/**
 * rename notebook
 * api:renamelib
 * parmas(apptoken,name,groupId)
 */
export const renamelib = baseurl
/**
 * Delete notebook
 * api:dellib
 * parmas(apptoken,groupId)
 */
export const dellib = baseurl
 /**
 * get Domain name list
 * api:nsinfos
 * parmas(apptoken)
 */
export const nsinfos = baseurl
 /**
 * bind domain name
 * api:boundnameservice
 * parmas(apptoken,p1(das xxxx.bit /ens xxxx.eth),p2: ens /das)
 */
export const boundnameservice = baseurl
 /**
 * get userInfo by Domain name 
 * api:customerinfobyns
 * parmas(apptoken,p1(Domain name))
 */
export const customerinfobyns = baseurl

/**
 * get twitterInfo by token
 * api:twitterinfo
 * parmas(apptoken)
 */
export const twitterinfo = baseurl

/**
 * get twitter Authorization url
 * api:twitterauth
 * parmas(apptoken) 
 */
export const twitterauth = baseurl

/**
 * twitter Authorization
 * api:twitterauthcallback
 * parmas(apptoken,oauth_token,oauth_verifier)
 */
export const twitterauthcallback = baseurl
 
/**
 * cancel twitter Authorization
 * api:twitterrevokeauth
 * parmas(apptoken)
 */
export const twitterrevokeauth = baseurl