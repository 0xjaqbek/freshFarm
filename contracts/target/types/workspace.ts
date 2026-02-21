/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/workspace.json`.
 */
export type Workspace = {
  "address": "7ETsTKTvvjbE89kEQJARuJcUnN18n28Fy972zik2tAnN",
  "metadata": {
    "name": "workspace",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "backCampaignSol",
      "discriminator": [
        60,
        62,
        214,
        61,
        69,
        194,
        196,
        125
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.farmer",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "tier",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "campaign.farmer",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "backing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  99,
                  107,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "backer"
              }
            ]
          }
        },
        {
          "name": "backer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tierId",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "backCampaignToken",
      "discriminator": [
        200,
        99,
        118,
        139,
        57,
        113,
        120,
        41
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.farmer",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "tier",
          "writable": true
        },
        {
          "name": "vaultToken",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.farmer",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "currencyMint"
        },
        {
          "name": "backerToken",
          "writable": true
        },
        {
          "name": "backing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  99,
                  107,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "backer"
              }
            ]
          }
        },
        {
          "name": "backer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tierId",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimRefundSol",
      "discriminator": [
        8,
        82,
        5,
        144,
        194,
        114,
        255,
        20
      ],
      "accounts": [
        {
          "name": "campaign",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.farmer",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "campaign.farmer",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "backing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  99,
                  107,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "backer"
              }
            ]
          }
        },
        {
          "name": "backer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "claimRefundToken",
      "discriminator": [
        70,
        225,
        166,
        28,
        61,
        62,
        226,
        45
      ],
      "accounts": [
        {
          "name": "campaign",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.farmer",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "vaultToken",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.farmer",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "currencyMint"
        },
        {
          "name": "backerToken",
          "writable": true
        },
        {
          "name": "backing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  99,
                  107,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "backer"
              }
            ]
          }
        },
        {
          "name": "backer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "createCampaign",
      "discriminator": [
        111,
        131,
        187,
        98,
        160,
        193,
        114,
        244
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "config.authority",
                "account": "config"
              }
            ]
          }
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "farmer"
              },
              {
                "kind": "arg",
                "path": "campaignId"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "farmer"
              },
              {
                "kind": "arg",
                "path": "campaignId"
              }
            ]
          }
        },
        {
          "name": "currencyMint"
        },
        {
          "name": "farmer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "campaignId",
          "type": "u64"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "goalAmount",
          "type": "u64"
        },
        {
          "name": "durationDays",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createTier",
      "discriminator": [
        64,
        146,
        139,
        178,
        95,
        123,
        94,
        244
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "farmer"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "tier",
          "writable": true
        },
        {
          "name": "farmer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tierId",
          "type": "u8"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "minAmount",
          "type": "u64"
        },
        {
          "name": "maxAmount",
          "type": "u64"
        },
        {
          "name": "benefits",
          "type": "string"
        },
        {
          "name": "maxBackers",
          "type": "u32"
        }
      ]
    },
    {
      "name": "finalizeCampaign",
      "discriminator": [
        241,
        76,
        201,
        221,
        33,
        222,
        220,
        138
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign.farmer",
                "account": "campaign"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "initializeConfig",
      "discriminator": [
        208,
        127,
        21,
        1,
        194,
        190,
        196,
        70
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "feeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "withdrawFundsSol",
      "discriminator": [
        25,
        65,
        192,
        167,
        229,
        2,
        74,
        132
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "config.authority",
                "account": "config"
              }
            ]
          }
        },
        {
          "name": "campaign",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "farmer"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "farmer"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "farmer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "withdrawFundsToken",
      "discriminator": [
        98,
        119,
        147,
        50,
        236,
        1,
        55,
        191
      ],
      "accounts": [
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "config.authority",
                "account": "config"
              }
            ]
          }
        },
        {
          "name": "campaign",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "farmer"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "vaultToken",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "farmer"
              },
              {
                "kind": "account",
                "path": "campaign.campaign_id",
                "account": "campaign"
              }
            ]
          }
        },
        {
          "name": "currencyMint"
        },
        {
          "name": "farmerToken",
          "writable": true
        },
        {
          "name": "treasuryToken",
          "writable": true
        },
        {
          "name": "farmer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "backing",
      "discriminator": [
        183,
        154,
        102,
        51,
        83,
        11,
        152,
        65
      ]
    },
    {
      "name": "campaign",
      "discriminator": [
        50,
        40,
        49,
        11,
        157,
        220,
        229,
        192
      ]
    },
    {
      "name": "campaignTier",
      "discriminator": [
        192,
        78,
        69,
        236,
        132,
        6,
        164,
        241
      ]
    },
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "mathOverflow",
      "msg": "Math overflow occurred"
    },
    {
      "code": 6001,
      "name": "unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6002,
      "name": "invalidFee",
      "msg": "Invalid fee percentage"
    },
    {
      "code": 6003,
      "name": "titleTooLong",
      "msg": "Title too long (max 64 chars)"
    },
    {
      "code": 6004,
      "name": "descriptionTooLong",
      "msg": "Description too long (max 256 chars)"
    },
    {
      "code": 6005,
      "name": "nameTooLong",
      "msg": "Name too long (max 32 chars)"
    },
    {
      "code": 6006,
      "name": "benefitsTooLong",
      "msg": "Benefits too long (max 256 chars)"
    },
    {
      "code": 6007,
      "name": "invalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6008,
      "name": "invalidDuration",
      "msg": "Invalid duration"
    },
    {
      "code": 6009,
      "name": "invalidTierRange",
      "msg": "Invalid tier range"
    },
    {
      "code": 6010,
      "name": "platformInactive",
      "msg": "Platform is inactive"
    },
    {
      "code": 6011,
      "name": "campaignNotActive",
      "msg": "Campaign is not active"
    },
    {
      "code": 6012,
      "name": "campaignFinalized",
      "msg": "Campaign is already finalized"
    },
    {
      "code": 6013,
      "name": "campaignNotStarted",
      "msg": "Campaign has not started yet"
    },
    {
      "code": 6014,
      "name": "campaignEnded",
      "msg": "Campaign has ended"
    },
    {
      "code": 6015,
      "name": "campaignNotEnded",
      "msg": "Campaign has not ended yet"
    },
    {
      "code": 6016,
      "name": "campaignNotFinalized",
      "msg": "Campaign is not finalized"
    },
    {
      "code": 6017,
      "name": "campaignAlreadyFinalized",
      "msg": "Campaign already finalized"
    },
    {
      "code": 6018,
      "name": "invalidTier",
      "msg": "Invalid tier"
    },
    {
      "code": 6019,
      "name": "amountBelowMinimum",
      "msg": "Amount below minimum"
    },
    {
      "code": 6020,
      "name": "amountAboveMaximum",
      "msg": "Amount above maximum"
    },
    {
      "code": 6021,
      "name": "tierFull",
      "msg": "Tier is full"
    },
    {
      "code": 6022,
      "name": "invalidMint",
      "msg": "Invalid mint"
    },
    {
      "code": 6023,
      "name": "goalNotReached",
      "msg": "Goal not reached"
    },
    {
      "code": 6024,
      "name": "goalReached",
      "msg": "Goal was reached, no refunds available"
    },
    {
      "code": 6025,
      "name": "alreadyRefunded",
      "msg": "Already refunded"
    },
    {
      "code": 6026,
      "name": "noFundsToWithdraw",
      "msg": "No funds to withdraw"
    }
  ],
  "types": [
    {
      "name": "backing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "backer",
            "type": "pubkey"
          },
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "tierId",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "backedAt",
            "type": "i64"
          },
          {
            "name": "isRefunded",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "farmer",
            "type": "pubkey"
          },
          {
            "name": "campaignId",
            "type": "u64"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "goalAmount",
            "type": "u64"
          },
          {
            "name": "raisedAmount",
            "type": "u64"
          },
          {
            "name": "currencyMint",
            "type": "pubkey"
          },
          {
            "name": "startTime",
            "type": "i64"
          },
          {
            "name": "endTime",
            "type": "i64"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "isFinalized",
            "type": "bool"
          },
          {
            "name": "backersCount",
            "type": "u64"
          },
          {
            "name": "tiersCount",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "campaignTier",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "tierId",
            "type": "u8"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "minAmount",
            "type": "u64"
          },
          {
            "name": "maxAmount",
            "type": "u64"
          },
          {
            "name": "benefits",
            "type": "string"
          },
          {
            "name": "maxBackers",
            "type": "u32"
          },
          {
            "name": "currentBackers",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "feeBps",
            "type": "u16"
          },
          {
            "name": "totalCampaigns",
            "type": "u64"
          },
          {
            "name": "totalRaised",
            "type": "u64"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "isPaused",
            "type": "bool"
          },
          {
            "name": "version",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
