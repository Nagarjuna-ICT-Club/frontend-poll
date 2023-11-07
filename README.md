# Nagarjuna ICT Club - Photography Contest

This software provides the platform for online voting and calculates ranks according to votes count and popularity

## How Popularity is calculated?

Popularity of phographs/contestants is determined by the nauture of voters/club members.

```js
   Members : {
      Name:
      Faculty:
      Semester:
}
```

Points for each votes is assigned as:
- Voter from same semester/class = 1 points
- Voter from same faculty and not same semester = 2 points
- Voter from different faculty = 3 points

### Algorithm

```js
 voters.map(voter=>{
    const voter_ = getVoterMembership(voter)
    if(voter_.Faculty == author.Faculty){
      
      if(voter_.Semester== author.Semester){
        number+=1;
      }else{
        number+=2;
      }
    }else{
      number+=3;
    }
  })
  return number;
}
```
### Example
 For contestant : CSITSKM101E
   Voters = 10 (3 CSIT, 3 BIM, 2 BCA, 2 BBM)
   popularity points = 3*2 + 3*3 + 2*3 + 2*3
   
   

