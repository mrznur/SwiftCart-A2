১) null এবং undefined এর পার্থক্য

JavaScript এ undefined আর null দেখতে একই রকম মনে হলেও আসলে এক জিনিস না।

যখন কোনো ভেরিয়েবল declare করা হয় কিন্তু কোনো মান দেওয়া হয় না, তখন সেটার মান থাকে undefined। এটা JavaScript নিজে থেকে সেট করে।

let a;
console.log(a); // undefined


অন্যদিকে null আমরা নিজেরা দিই। যখন আমরা ইচ্ছা করে বলি এই ভেরিয়েবলের কোনো মান নেই, তখন null ব্যবহার করি।

let b = null;
console.log(b); // null


সহজভাবে বললে:

undefined মানে এখনো মান দেওয়া হয়নি

null মানে ইচ্ছা করে খালি রাখা হয়েছে

আর একটা জিনিস খেয়াল করার মতো —
null == undefined true দেয়
কিন্তু null === undefined false দেয়

২) map() এবং forEach() এর পার্থক্য

দুটোই array নিয়ে কাজ করে, কিন্তু কাজের ধরন আলাদা।

map() ব্যবহার করলে প্রতিটি element এর উপর কাজ হয় এবং শেষে একটি নতুন array পাওয়া যায়।

let nums = [1, 2, 3];
let result = nums.map(n => n * 2);
console.log(result); // [2, 4, 6]


এখানে original array বদলায় না, নতুন array তৈরি হয়।

forEach() ও প্রতিটি element এর উপর কাজ করে, কিন্তু এটি কিছু return করে না। শুধু loop চালায়।

let nums = [1, 2, 3];
nums.forEach(n => console.log(n * 2));


পার্থক্য সহজভাবে:

map → নতুন array দেয়

forEach → শুধু কাজ করে, কিছু দেয় না

৩) == এবং === এর পার্থক্য

== আর === দুইটাই comparison operator, কিন্তু একভাবে কাজ করে না।

== শুধু মান তুলনা করে। দরকার হলে type convert করে নেয়।

console.log(5 == "5"); // true


এখানে string "5" কে number 5 বানিয়ে তুলনা করেছে।

কিন্তু === মান আর type দুইটাই দেখে।

console.log(5 === "5"); // false


কারণ একটার type number, আরেকটা string।

সাধারণভাবে === ব্যবহার করাই ভালো, কারণ এতে ভুল হওয়ার সম্ভাবনা কম।

৪) async/await কেন দরকার API fetch করার সময়

API থেকে ডেটা আনা asynchronous কাজ। মানে সাথে সাথে ডেটা পাওয়া যায় না, কিছু সময় লাগে।

আগে .then() দিয়ে promise handle করা হতো। কিন্তু কোড অনেক সময় জটিল হয়ে যেত।

async/await ব্যবহার করলে কোড অনেক সহজ আর readable হয়।

async function getData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  console.log(data);
}


এখানে await না দিলে ডেটা পাওয়ার আগেই পরের লাইন চলে যেত।

এটার সুবিধা হলো:

কোড দেখতে synchronous এর মতো লাগে

বুঝতে সহজ

try/catch দিয়ে সহজে error handle করা যায়

৫) Scope কী?

Scope মানে হলো কোনো ভেরিয়েবল কোথায় ব্যবহার করা যাবে।

তিন ধরনের scope আছে।

Global Scope

যদি কোনো ভেরিয়েবল function এর বাইরে declare করা হয়, তাহলে সেটা global।

let name = "Rahim";


এটা যেকোনো জায়গা থেকে ব্যবহার করা যায়।

Function Scope

যদি function এর ভিতরে declare করা হয়, তাহলে সেটা শুধু ওই function এর ভিতরেই থাকবে।

function test() {
  let age = 20;
  console.log(age);
}


ফাংশনের বাইরে গেলে এটা পাওয়া যাবে না।

Block Scope

let আর const দিয়ে {} এর ভিতরে declare করলে সেটা block scope হয়।

if (true) {
  let city = "Dhaka";
}


এখানে city বাইরে ব্যবহার করলে error দেবে।

সবশেষে একটা কথা —
ভালো practice হলো var এড়িয়ে let আর const ব্যবহার করা, আর অপ্রয়োজনীয় global variable না রাখা।

SwiftCart Project
ফেব্রুয়ারি ২০২৬