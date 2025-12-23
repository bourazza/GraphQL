export const queries = {
    user: `{
        user {
            id
            login
            email
            auditRatio
			avatarUrl
        }
    }`,
    
    xp: `{
  transaction(
    where: {
      type: { _eq: "xp" }
      _and: [
        { path: { _nlike: "/oujda/module/piscine-js/%" } }
        { path: { _nlike: "/oujda/piscine-go-oujda%" } }
      ]
    }
  ) {
    amount
    createdAt
    path
  }
}
`,
    
    progress: `{
        progress(where: {grade: {_gte: 1}, object: {type: {_eq: "project"}}}) {
            id
            path
        }
    }`,
    
    level: `{
        transaction(where: {type: {_eq: "level"}, event: {object: {name: {_eq: "Module"}}}}, order_by: {amount: desc}, limit: 1) {
            amount
        }
    }`,
    
    skills: `{
        transaction(where: {type: {_like: "skill_%"}}, distinct_on: type, order_by: {type: asc, amount: desc}) {
            type
            amount
        }
    }`,
    
    audit: `{
        user {
            auditRatio
            auditsAssigned
            audits_aggregate(where: {closureType: {_eq: succeeded}}) {
                aggregate {
                    count
                }
            }
            failed_audits: audits_aggregate(where: {closureType: {_eq: failed}}) {
                aggregate {
                    count
                }
            }
        }
    }`
};
