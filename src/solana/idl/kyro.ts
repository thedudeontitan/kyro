/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/kyro.json`.
 */
export type Kyro = {
  "address": "2YTxz5iVKX6SspwxvhK67rpp3o9TKfWLspW1U69AprtS",
  "metadata": {
    "name": "kyro",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Kyro Credit Protocol - Solana Port"
  },
  "instructions": [
    {
      "name": "acceptAdmin",
      "docs": [
        "Accept pending admin transfer"
      ],
      "discriminator": [
        112,
        42,
        45,
        90,
        116,
        181,
        13,
        170
      ],
      "accounts": [
        {
          "name": "newAdmin",
          "signer": true
        },
        {
          "name": "creditManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "reputationManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "addCollateral",
      "docs": [
        "Add collateral to an existing credit line (also reactivates inactive credit lines)"
      ],
      "discriminator": [
        127,
        82,
        121,
        42,
        161,
        176,
        249,
        206
      ],
      "accounts": [
        {
          "name": "borrower",
          "writable": true,
          "signer": true
        },
        {
          "name": "creditManager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creditLine",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  108,
                  105,
                  110,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "collateralInfo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  97,
                  116,
                  101,
                  114,
                  97,
                  108,
                  95,
                  105,
                  110,
                  102,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "borrowerTokenAccount",
          "docs": [
            "Borrower's USDC token account"
          ],
          "writable": true
        },
        {
          "name": "collateralVault",
          "docs": [
            "Collateral vault"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  97,
                  116,
                  101,
                  114,
                  97,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "collateralAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "borrow",
      "docs": [
        "Borrow funds from the pool (sent to borrower)"
      ],
      "discriminator": [
        228,
        253,
        131,
        202,
        207,
        116,
        89,
        18
      ],
      "accounts": [
        {
          "name": "borrower",
          "writable": true,
          "signer": true
        },
        {
          "name": "creditManager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creditLine",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  108,
                  105,
                  110,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "collateralInfo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  97,
                  116,
                  101,
                  114,
                  97,
                  108,
                  95,
                  105,
                  110,
                  102,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "borrowerTokenAccount",
          "docs": [
            "Borrower's USDC token account (receives the borrowed funds)"
          ],
          "writable": true
        },
        {
          "name": "poolVault",
          "docs": [
            "Pool vault (source of borrowed funds)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "borrowAndPay",
      "docs": [
        "Borrow funds and pay directly to a recipient"
      ],
      "discriminator": [
        150,
        198,
        81,
        242,
        165,
        183,
        144,
        123
      ],
      "accounts": [
        {
          "name": "borrower",
          "writable": true,
          "signer": true
        },
        {
          "name": "creditManager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creditLine",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  108,
                  105,
                  110,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "collateralInfo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  97,
                  116,
                  101,
                  114,
                  97,
                  108,
                  95,
                  105,
                  110,
                  102,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "recipientTokenAccount",
          "docs": [
            "Recipient's USDC token account (receives the payment)"
          ],
          "writable": true
        },
        {
          "name": "poolVault",
          "docs": [
            "Pool vault (source of borrowed funds)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "recipient",
          "type": "pubkey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelAdminTransfer",
      "docs": [
        "Cancel pending admin transfer"
      ],
      "discriminator": [
        38,
        131,
        157,
        31,
        240,
        137,
        44,
        215
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "creditManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "deposit",
      "docs": [
        "Deposit USDC into the lending pool"
      ],
      "discriminator": [
        242,
        35,
        198,
        137,
        82,
        225,
        242,
        182
      ],
      "accounts": [
        {
          "name": "lender",
          "writable": true,
          "signer": true
        },
        {
          "name": "creditManager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "lenderInfo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  101,
                  114,
                  95,
                  105,
                  110,
                  102,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "lender"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "lenderTokenAccount",
          "docs": [
            "Lender's USDC token account"
          ],
          "writable": true
        },
        {
          "name": "poolVault",
          "docs": [
            "Pool vault"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
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
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "docs": [
        "Initialize the entire protocol: CreditManager, LendingPool, ReputationManager, and all vaults"
      ],
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "creditManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "reputationManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "usdcMint",
          "docs": [
            "USDC mint"
          ]
        },
        {
          "name": "poolVault",
          "docs": [
            "Pool vault for lender deposits and borrows"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "collateralVault",
          "docs": [
            "Collateral vault for borrower collateral"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  97,
                  116,
                  101,
                  114,
                  97,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "protocolFeesVault",
          "docs": [
            "Protocol fees vault"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  95,
                  102,
                  101,
                  101,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "liquidate",
      "docs": [
        "Liquidate a borrower's position (admin only, when over LTV or overdue)"
      ],
      "discriminator": [
        223,
        179,
        226,
        125,
        48,
        46,
        39,
        74
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "creditManager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creditLine",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  108,
                  105,
                  110,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "borrowerKey"
              }
            ]
          }
        },
        {
          "name": "collateralInfo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  97,
                  116,
                  101,
                  114,
                  97,
                  108,
                  95,
                  105,
                  110,
                  102,
                  111
                ]
              },
              {
                "kind": "arg",
                "path": "borrowerKey"
              }
            ]
          }
        },
        {
          "name": "reputationManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "reputationData",
          "docs": [
            "Per-user reputation data. init_if_needed since liquidation may be first reputation interaction."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "borrowerKey"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "collateralVault",
          "docs": [
            "Collateral vault (collateral stays in vault — no transfer on liquidation)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  97,
                  116,
                  101,
                  114,
                  97,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "poolVault",
          "docs": [
            "Pool vault (seized collateral gets transferred here to cover bad debt)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
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
          "name": "borrower",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "openCreditLine",
      "docs": [
        "Open a new credit line with collateral deposit"
      ],
      "discriminator": [
        126,
        111,
        245,
        44,
        233,
        249,
        30,
        238
      ],
      "accounts": [
        {
          "name": "borrower",
          "writable": true,
          "signer": true
        },
        {
          "name": "creditManager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creditLine",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  108,
                  105,
                  110,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "collateralInfo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  97,
                  116,
                  101,
                  114,
                  97,
                  108,
                  95,
                  105,
                  110,
                  102,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "borrowerTokenAccount",
          "docs": [
            "Borrower's USDC token account"
          ],
          "writable": true
        },
        {
          "name": "collateralVault",
          "docs": [
            "Collateral vault"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  97,
                  116,
                  101,
                  114,
                  97,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
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
          "name": "collateralAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "pause",
      "docs": [
        "Pause the entire protocol"
      ],
      "discriminator": [
        211,
        22,
        221,
        251,
        74,
        121,
        193,
        47
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "creditManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "reputationManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "repay",
      "docs": [
        "Repay borrowed funds (principal and/or interest)"
      ],
      "discriminator": [
        234,
        103,
        67,
        82,
        208,
        234,
        219,
        166
      ],
      "accounts": [
        {
          "name": "borrower",
          "writable": true,
          "signer": true
        },
        {
          "name": "creditManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creditLine",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  108,
                  105,
                  110,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "reputationManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "reputationData",
          "docs": [
            "Per-user reputation data. init_if_needed since first repay may be first reputation interaction."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "borrowerTokenAccount",
          "docs": [
            "Borrower's USDC token account"
          ],
          "writable": true
        },
        {
          "name": "poolVault",
          "docs": [
            "Pool vault (receives repayment)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
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
          "name": "principalAmount",
          "type": "u64"
        },
        {
          "name": "interestAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferAdmin",
      "docs": [
        "Initiate a two-step admin transfer"
      ],
      "discriminator": [
        42,
        242,
        66,
        106,
        228,
        10,
        111,
        156
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "creditManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "newAdmin",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "unpause",
      "docs": [
        "Unpause the entire protocol"
      ],
      "discriminator": [
        169,
        144,
        4,
        38,
        10,
        141,
        188,
        255
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "creditManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "reputationManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "updateParameters",
      "docs": [
        "Update credit protocol parameters (interest rate, reputation threshold, credit multiplier)"
      ],
      "discriminator": [
        116,
        107,
        24,
        207,
        101,
        49,
        213,
        77
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "creditManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "fixedInterestRate",
          "type": "u64"
        },
        {
          "name": "reputationThreshold",
          "type": "u64"
        },
        {
          "name": "creditIncreaseMultiplier",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateReputationParameters",
      "docs": [
        "Update reputation scoring parameters"
      ],
      "discriminator": [
        246,
        40,
        236,
        189,
        137,
        16,
        0,
        59
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "creditManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "reputationManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  112,
                  117,
                  116,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "onTimeBonus",
          "type": "u64"
        },
        {
          "name": "latePaymentPenalty",
          "type": "u64"
        },
        {
          "name": "defaultPenalty",
          "type": "u64"
        },
        {
          "name": "maxScoreChange",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "docs": [
        "Withdraw USDC from the lending pool (interest deducted first, then principal)"
      ],
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "lender",
          "writable": true,
          "signer": true
        },
        {
          "name": "creditManager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "lenderInfo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  101,
                  114,
                  95,
                  105,
                  110,
                  102,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "lender"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "lenderTokenAccount",
          "docs": [
            "Lender's USDC token account"
          ],
          "writable": true
        },
        {
          "name": "poolVault",
          "docs": [
            "Pool vault"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawCollateral",
      "docs": [
        "Withdraw collateral (only when no outstanding debt)"
      ],
      "discriminator": [
        115,
        135,
        168,
        106,
        139,
        214,
        138,
        150
      ],
      "accounts": [
        {
          "name": "borrower",
          "writable": true,
          "signer": true
        },
        {
          "name": "creditManager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingPool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "creditLine",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  114,
                  101,
                  100,
                  105,
                  116,
                  95,
                  108,
                  105,
                  110,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "collateralInfo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  97,
                  116,
                  101,
                  114,
                  97,
                  108,
                  95,
                  105,
                  110,
                  102,
                  111
                ]
              },
              {
                "kind": "account",
                "path": "borrower"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "borrowerTokenAccount",
          "docs": [
            "Borrower's USDC token account"
          ],
          "writable": true
        },
        {
          "name": "collateralVault",
          "docs": [
            "Collateral vault"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  108,
                  108,
                  97,
                  116,
                  101,
                  114,
                  97,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "poolVault",
          "docs": [
            "Pool vault (interest may come from here)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "collateralInfo",
      "discriminator": [
        163,
        68,
        82,
        37,
        220,
        178,
        18,
        153
      ]
    },
    {
      "name": "creditLine",
      "discriminator": [
        220,
        226,
        205,
        24,
        220,
        151,
        129,
        104
      ]
    },
    {
      "name": "creditManagerState",
      "discriminator": [
        109,
        145,
        164,
        174,
        29,
        148,
        63,
        202
      ]
    },
    {
      "name": "lenderInfo",
      "discriminator": [
        241,
        202,
        211,
        181,
        44,
        218,
        249,
        11
      ]
    },
    {
      "name": "lendingPoolState",
      "discriminator": [
        136,
        103,
        75,
        166,
        104,
        12,
        210,
        203
      ]
    },
    {
      "name": "reputationData",
      "discriminator": [
        223,
        191,
        121,
        62,
        74,
        60,
        117,
        22
      ]
    },
    {
      "name": "reputationManagerState",
      "discriminator": [
        126,
        16,
        50,
        48,
        170,
        86,
        33,
        25
      ]
    }
  ],
  "events": [
    {
      "name": "adminTransferCancelledEvent",
      "discriminator": [
        175,
        140,
        104,
        221,
        194,
        183,
        79,
        71
      ]
    },
    {
      "name": "adminTransferCompletedEvent",
      "discriminator": [
        45,
        61,
        146,
        62,
        46,
        238,
        84,
        243
      ]
    },
    {
      "name": "adminTransferInitiatedEvent",
      "discriminator": [
        227,
        26,
        43,
        16,
        228,
        108,
        170,
        243
      ]
    },
    {
      "name": "badDebtWrittenOffEvent",
      "discriminator": [
        205,
        47,
        14,
        95,
        57,
        88,
        96,
        121
      ]
    },
    {
      "name": "borrowEvent",
      "discriminator": [
        86,
        8,
        140,
        206,
        215,
        179,
        118,
        201
      ]
    },
    {
      "name": "borrowedEvent",
      "discriminator": [
        46,
        5,
        1,
        138,
        156,
        135,
        208,
        158
      ]
    },
    {
      "name": "collateralAddedEvent",
      "discriminator": [
        90,
        251,
        19,
        246,
        134,
        164,
        243,
        177
      ]
    },
    {
      "name": "collateralDepositedEvent",
      "discriminator": [
        76,
        214,
        14,
        34,
        152,
        143,
        196,
        5
      ]
    },
    {
      "name": "collateralSeizedEvent",
      "discriminator": [
        9,
        23,
        218,
        187,
        142,
        114,
        53,
        26
      ]
    },
    {
      "name": "collateralWithdrawnEvent",
      "discriminator": [
        213,
        133,
        147,
        44,
        32,
        59,
        29,
        112
      ]
    },
    {
      "name": "creditOpenedEvent",
      "discriminator": [
        67,
        180,
        242,
        226,
        126,
        184,
        25,
        231
      ]
    },
    {
      "name": "defaultRecordedEvent",
      "discriminator": [
        129,
        211,
        247,
        176,
        159,
        191,
        148,
        247
      ]
    },
    {
      "name": "depositEvent",
      "discriminator": [
        120,
        248,
        61,
        83,
        31,
        142,
        107,
        144
      ]
    },
    {
      "name": "directPaymentEvent",
      "discriminator": [
        63,
        202,
        70,
        36,
        225,
        146,
        182,
        33
      ]
    },
    {
      "name": "lendingCollateralWithdrawnEvent",
      "discriminator": [
        98,
        223,
        26,
        183,
        139,
        38,
        133,
        167
      ]
    },
    {
      "name": "liquidatedEvent",
      "discriminator": [
        174,
        69,
        181,
        104,
        167,
        3,
        107,
        164
      ]
    },
    {
      "name": "parametersUpdatedEvent",
      "discriminator": [
        18,
        212,
        88,
        71,
        35,
        165,
        8,
        22
      ]
    },
    {
      "name": "pausedEvent",
      "discriminator": [
        43,
        14,
        250,
        236,
        116,
        42,
        177,
        89
      ]
    },
    {
      "name": "repaidEvent",
      "discriminator": [
        145,
        120,
        77,
        46,
        93,
        201,
        30,
        67
      ]
    },
    {
      "name": "repayEvent",
      "discriminator": [
        129,
        213,
        0,
        108,
        218,
        108,
        82,
        140
      ]
    },
    {
      "name": "reputationParametersUpdatedEvent",
      "discriminator": [
        188,
        22,
        210,
        17,
        223,
        152,
        47,
        249
      ]
    },
    {
      "name": "scoreUpdatedEvent",
      "discriminator": [
        104,
        92,
        23,
        182,
        119,
        129,
        199,
        48
      ]
    },
    {
      "name": "tierChangedEvent",
      "discriminator": [
        84,
        222,
        139,
        243,
        97,
        249,
        173,
        111
      ]
    },
    {
      "name": "unpausedEvent",
      "discriminator": [
        150,
        198,
        191,
        67,
        103,
        86,
        160,
        55
      ]
    },
    {
      "name": "userInitializedEvent",
      "discriminator": [
        19,
        253,
        52,
        134,
        6,
        229,
        85,
        119
      ]
    },
    {
      "name": "withdrawEvent",
      "discriminator": [
        22,
        9,
        133,
        26,
        160,
        44,
        71,
        192
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "notAuthorized",
      "msg": "Not authorized"
    },
    {
      "code": 6001,
      "name": "invalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6002,
      "name": "creditLineExists",
      "msg": "Credit line already exists"
    },
    {
      "code": 6003,
      "name": "creditLineNotActive",
      "msg": "Credit line not active"
    },
    {
      "code": 6004,
      "name": "exceedsCreditLimit",
      "msg": "Exceeds credit limit"
    },
    {
      "code": 6005,
      "name": "insufficientLiquidity",
      "msg": "Insufficient liquidity"
    },
    {
      "code": 6006,
      "name": "exceedsBorrowedAmount",
      "msg": "Exceeds borrowed amount"
    },
    {
      "code": 6007,
      "name": "exceedsInterest",
      "msg": "Exceeds interest"
    },
    {
      "code": 6008,
      "name": "liquidationNotAllowed",
      "msg": "Liquidation not allowed"
    },
    {
      "code": 6009,
      "name": "alreadyInitialized",
      "msg": "Already initialized"
    },
    {
      "code": 6010,
      "name": "invalidAddress",
      "msg": "Invalid address"
    },
    {
      "code": 6011,
      "name": "pendingAdminNotSet",
      "msg": "Pending admin not set"
    },
    {
      "code": 6012,
      "name": "notPendingAdmin",
      "msg": "Not pending admin"
    },
    {
      "code": 6013,
      "name": "belowMinimumAmount",
      "msg": "Below minimum amount"
    },
    {
      "code": 6014,
      "name": "noActiveDebt",
      "msg": "No active debt"
    },
    {
      "code": 6015,
      "name": "hasOutstandingDebt",
      "msg": "Has outstanding debt"
    },
    {
      "code": 6016,
      "name": "invalidParameters",
      "msg": "Invalid parameters"
    },
    {
      "code": 6017,
      "name": "mathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6018,
      "name": "insufficientBalance",
      "msg": "Insufficient balance"
    },
    {
      "code": 6019,
      "name": "paused",
      "msg": "Protocol is paused"
    },
    {
      "code": 6020,
      "name": "collateralNotFound",
      "msg": "Collateral not found"
    },
    {
      "code": 6021,
      "name": "lenderNotFound",
      "msg": "Lender not found"
    }
  ],
  "types": [
    {
      "name": "adminTransferCancelledEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "cancelledPendingAdmin",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "adminTransferCompletedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oldAdmin",
            "type": "pubkey"
          },
          {
            "name": "newAdmin",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "adminTransferInitiatedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "currentAdmin",
            "type": "pubkey"
          },
          {
            "name": "pendingAdmin",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "badDebtWrittenOffEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "borrowEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "borrowedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "totalBorrowed",
            "type": "u64"
          },
          {
            "name": "dueDate",
            "type": "i64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "collateralAddedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "totalCollateral",
            "type": "u64"
          },
          {
            "name": "newCreditLimit",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "collateralDepositedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "totalCollateral",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "collateralInfo",
      "docs": [
        "Per-borrower collateral tracking (PDA seeded by borrower pubkey)"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "docs": [
              "Borrower's public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "depositedAmount",
            "docs": [
              "Principal collateral deposited"
            ],
            "type": "u64"
          },
          {
            "name": "earnedInterest",
            "docs": [
              "Settled (realized) interest earnings on collateral"
            ],
            "type": "u64"
          },
          {
            "name": "rewardDebt",
            "docs": [
              "Reward debt for O(1) accumulator pattern"
            ],
            "type": "u128"
          },
          {
            "name": "depositTimestamp",
            "docs": [
              "Timestamp of collateral deposit"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "collateralSeizedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "amountSeized",
            "type": "u64"
          },
          {
            "name": "interestSeized",
            "type": "u64"
          },
          {
            "name": "remainingCollateral",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "collateralWithdrawnEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "interestEarned",
            "type": "u64"
          },
          {
            "name": "remainingCollateral",
            "type": "u64"
          },
          {
            "name": "remainingCreditLimit",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "creditLine",
      "docs": [
        "Per-borrower credit line (PDA seeded by borrower pubkey)"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "docs": [
              "Borrower's public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "initialCollateral",
            "docs": [
              "Original collateral deposited (for reference tracking)"
            ],
            "type": "u64"
          },
          {
            "name": "borrowedAmount",
            "docs": [
              "Current outstanding borrowed amount"
            ],
            "type": "u64"
          },
          {
            "name": "lastBorrowedTimestamp",
            "docs": [
              "Timestamp of last borrow action"
            ],
            "type": "i64"
          },
          {
            "name": "interestAccrued",
            "docs": [
              "Accrued interest on the borrowed amount"
            ],
            "type": "u64"
          },
          {
            "name": "lastInterestUpdate",
            "docs": [
              "Timestamp of last interest calculation"
            ],
            "type": "i64"
          },
          {
            "name": "repaymentDueDate",
            "docs": [
              "Deadline for full repayment (grace + repayment window)"
            ],
            "type": "i64"
          },
          {
            "name": "isActive",
            "docs": [
              "Whether this credit line is active"
            ],
            "type": "bool"
          },
          {
            "name": "totalRepaid",
            "docs": [
              "Total amount repaid over lifetime"
            ],
            "type": "u64"
          },
          {
            "name": "onTimeRepayments",
            "docs": [
              "Number of on-time repayments"
            ],
            "type": "u64"
          },
          {
            "name": "lateRepayments",
            "docs": [
              "Number of late repayments"
            ],
            "type": "u64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "creditManagerState",
      "docs": [
        "Global protocol configuration (single PDA)"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "docs": [
              "Admin authority"
            ],
            "type": "pubkey"
          },
          {
            "name": "pendingAdmin",
            "docs": [
              "Two-step admin transfer: pending new admin"
            ],
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "fixedInterestRate",
            "docs": [
              "Fixed annual interest rate in basis points (e.g. 1500 = 15%)"
            ],
            "type": "u64"
          },
          {
            "name": "reputationThreshold",
            "docs": [
              "Reputation score threshold for credit increase eligibility"
            ],
            "type": "u64"
          },
          {
            "name": "creditIncreaseMultiplier",
            "docs": [
              "Credit increase multiplier in basis points (e.g. 12000 = 120%)"
            ],
            "type": "u64"
          },
          {
            "name": "usdcMint",
            "docs": [
              "USDC token mint"
            ],
            "type": "pubkey"
          },
          {
            "name": "isPaused",
            "docs": [
              "Whether the protocol is paused"
            ],
            "type": "bool"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "creditOpenedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "collateralAmount",
            "type": "u64"
          },
          {
            "name": "creditLimit",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "defaultRecordedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "debtAmount",
            "type": "u64"
          },
          {
            "name": "penaltyApplied",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "depositEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lender",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "directPaymentEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "totalBorrowed",
            "type": "u64"
          },
          {
            "name": "dueDate",
            "type": "i64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "lenderInfo",
      "docs": [
        "Per-lender deposit tracking (PDA seeded by lender pubkey)"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lender",
            "docs": [
              "Lender's public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "depositedAmount",
            "docs": [
              "Principal amount deposited"
            ],
            "type": "u64"
          },
          {
            "name": "earnedInterest",
            "docs": [
              "Settled (realized) interest earnings"
            ],
            "type": "u64"
          },
          {
            "name": "rewardDebt",
            "docs": [
              "Reward debt for O(1) accumulator pattern: deposited * acc_per_share at last settlement"
            ],
            "type": "u128"
          },
          {
            "name": "initialDepositTimestamp",
            "docs": [
              "Timestamp of first deposit (never overwritten)"
            ],
            "type": "i64"
          },
          {
            "name": "lastDepositTimestamp",
            "docs": [
              "Timestamp of most recent deposit"
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "lendingCollateralWithdrawnEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "interestEarned",
            "type": "u64"
          },
          {
            "name": "remainingCollateral",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "lendingPoolState",
      "docs": [
        "Global lending pool state (single PDA)"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "docs": [
              "Admin authority"
            ],
            "type": "pubkey"
          },
          {
            "name": "totalDeposited",
            "docs": [
              "Total deposited by lenders (principal only)"
            ],
            "type": "u64"
          },
          {
            "name": "totalCollateral",
            "docs": [
              "Total collateral deposited by borrowers"
            ],
            "type": "u64"
          },
          {
            "name": "totalBorrowed",
            "docs": [
              "Total borrowed from the pool"
            ],
            "type": "u64"
          },
          {
            "name": "totalRepaid",
            "docs": [
              "Total repaid to the pool"
            ],
            "type": "u64"
          },
          {
            "name": "protocolFeesCollected",
            "docs": [
              "Protocol fees collected (held in pool vault)"
            ],
            "type": "u64"
          },
          {
            "name": "accumulatedInterestPerShare",
            "docs": [
              "Global O(1) interest accumulator (scaled by PRECISION = 1e12)"
            ],
            "type": "u128"
          },
          {
            "name": "usdcMint",
            "docs": [
              "USDC token mint"
            ],
            "type": "pubkey"
          },
          {
            "name": "isPaused",
            "docs": [
              "Whether the pool is paused"
            ],
            "type": "bool"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "liquidatedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "collateralLiquidated",
            "type": "u64"
          },
          {
            "name": "debtCleared",
            "type": "u64"
          },
          {
            "name": "reason",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "parametersUpdatedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fixedInterestRate",
            "type": "u64"
          },
          {
            "name": "reputationThreshold",
            "type": "u64"
          },
          {
            "name": "creditIncreaseMultiplier",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "pausedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "repaidEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "principalAmount",
            "type": "u64"
          },
          {
            "name": "interestAmount",
            "type": "u64"
          },
          {
            "name": "remainingBalance",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "repayEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "borrower",
            "type": "pubkey"
          },
          {
            "name": "principal",
            "type": "u64"
          },
          {
            "name": "interest",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "reputationData",
      "docs": [
        "Per-user reputation data (PDA seeded by user pubkey)"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "docs": [
              "User's public key"
            ],
            "type": "pubkey"
          },
          {
            "name": "score",
            "docs": [
              "Current reputation score (0 - 1000)"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdated",
            "docs": [
              "Timestamp of last update"
            ],
            "type": "i64"
          },
          {
            "name": "totalRepayments",
            "docs": [
              "Total number of repayments"
            ],
            "type": "u64"
          },
          {
            "name": "onTimeRepayments",
            "docs": [
              "Number of on-time repayments"
            ],
            "type": "u64"
          },
          {
            "name": "lateRepayments",
            "docs": [
              "Number of late repayments"
            ],
            "type": "u64"
          },
          {
            "name": "defaults",
            "docs": [
              "Number of defaults"
            ],
            "type": "u64"
          },
          {
            "name": "tier",
            "docs": [
              "Current reputation tier (0=Bronze, 1=Silver, 2=Gold, 3=Platinum)"
            ],
            "type": "u8"
          },
          {
            "name": "isInitialized",
            "docs": [
              "Whether the user has been initialized in the reputation system"
            ],
            "type": "bool"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "reputationManagerState",
      "docs": [
        "Global reputation manager state (single PDA)"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "docs": [
              "Admin authority"
            ],
            "type": "pubkey"
          },
          {
            "name": "onTimeBonus",
            "docs": [
              "Score bonus for on-time repayment"
            ],
            "type": "u64"
          },
          {
            "name": "latePaymentPenalty",
            "docs": [
              "Score penalty for late payment"
            ],
            "type": "u64"
          },
          {
            "name": "defaultPenalty",
            "docs": [
              "Score penalty for default/liquidation"
            ],
            "type": "u64"
          },
          {
            "name": "maxScoreChange",
            "docs": [
              "Maximum score change in a single update"
            ],
            "type": "u64"
          },
          {
            "name": "isPaused",
            "docs": [
              "Whether the reputation system is paused"
            ],
            "type": "bool"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "reputationParametersUpdatedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "onTimeBonus",
            "type": "u64"
          },
          {
            "name": "latePaymentPenalty",
            "type": "u64"
          },
          {
            "name": "defaultPenalty",
            "type": "u64"
          },
          {
            "name": "maxScoreChange",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "scoreUpdatedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "oldScore",
            "type": "u64"
          },
          {
            "name": "newScore",
            "type": "u64"
          },
          {
            "name": "isIncrease",
            "type": "bool"
          },
          {
            "name": "reason",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "tierChangedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "oldTier",
            "type": "u8"
          },
          {
            "name": "newTier",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "unpausedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userInitializedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "initialScore",
            "type": "u64"
          },
          {
            "name": "initialTier",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "withdrawEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lender",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "interest",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
