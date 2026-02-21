use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{self, Token, TokenAccount, Mint, Transfer};

declare_id!("7ETsTKTvvjbE89kEQJARuJcUnN18n28Fy972zik2tAnN");

#[program]
pub mod workspace {
    use super::*;

    // fee_bps: u16, Platform fee in basis points, 250 = 2.5%
    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        fee_bps: u16,
    ) -> Result<()> {
        require!(fee_bps <= 10000, ErrorCode::InvalidFee);
        
        let config = &mut ctx.accounts.config;
        config.bump = ctx.bumps.config;
        config.authority = ctx.accounts.authority.key();
        config.fee_bps = fee_bps;
        config.total_campaigns = 0;
        config.total_raised = 0;
        config.is_active = true;
        config.is_paused = false;
        config.version = 1;
        
        Ok(())
    }

    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        campaign_id: u64,
        title: String,
        description: String,
        goal_amount: u64,
        duration_days: u64,
    ) -> Result<()> {
        require!(title.len() <= 64, ErrorCode::TitleTooLong);
        require!(description.len() <= 256, ErrorCode::DescriptionTooLong);
        require!(goal_amount > 0, ErrorCode::InvalidAmount);
        require!(duration_days > 0 && duration_days <= 365, ErrorCode::InvalidDuration);
        
        let config = &ctx.accounts.config;
        require!(config.is_active && !config.is_paused, ErrorCode::PlatformInactive);
        
        let clock = Clock::get()?;
        let start_time = clock.unix_timestamp;
        let end_time = start_time
            .checked_add((duration_days * 86400) as i64)
            .ok_or(ErrorCode::MathOverflow)?;
        
        let campaign = &mut ctx.accounts.campaign;
        campaign.bump = ctx.bumps.campaign;
        campaign.farmer = ctx.accounts.farmer.key();
        campaign.campaign_id = campaign_id;
        campaign.title = title;
        campaign.description = description;
        campaign.goal_amount = goal_amount;
        campaign.raised_amount = 0;
        campaign.currency_mint = ctx.accounts.currency_mint.key();
        campaign.start_time = start_time;
        campaign.end_time = end_time;
        campaign.is_active = true;
        campaign.is_finalized = false;
        campaign.backers_count = 0;
        campaign.tiers_count = 0;
        
        let config = &mut ctx.accounts.config;
        config.total_campaigns = config.total_campaigns
            .checked_add(1)
            .ok_or(ErrorCode::MathOverflow)?;
        
        Ok(())
    }

    pub fn create_tier(
        ctx: Context<CreateTier>,
        tier_id: u8,
        name: String,
        min_amount: u64,
        max_amount: u64,
        benefits: String,
        max_backers: u32,
    ) -> Result<()> {
        require!(name.len() <= 32, ErrorCode::NameTooLong);
        require!(benefits.len() <= 256, ErrorCode::BenefitsTooLong);
        require!(min_amount > 0, ErrorCode::InvalidAmount);
        require!(max_amount == 0 || max_amount >= min_amount, ErrorCode::InvalidTierRange);
        
        let campaign = &ctx.accounts.campaign;
        require!(campaign.farmer == ctx.accounts.farmer.key(), ErrorCode::Unauthorized);
        require!(campaign.is_active, ErrorCode::CampaignNotActive);
        require!(!campaign.is_finalized, ErrorCode::CampaignFinalized);
        
        let tier = &mut ctx.accounts.tier;
        tier.bump = ctx.bumps.tier;
        tier.campaign = ctx.accounts.campaign.key();
        tier.tier_id = tier_id;
        tier.name = name;
        tier.min_amount = min_amount;
        tier.max_amount = max_amount;
        tier.benefits = benefits;
        tier.max_backers = max_backers;
        tier.current_backers = 0;
        
        let campaign = &mut ctx.accounts.campaign;
        campaign.tiers_count = campaign.tiers_count
            .checked_add(1)
            .ok_or(ErrorCode::MathOverflow)?;
        
        Ok(())
    }

    pub fn back_campaign_sol(
        ctx: Context<BackCampaignSol>,
        tier_id: u8,
        amount: u64,
    ) -> Result<()> {
        let clock = Clock::get()?;
        let campaign = &ctx.accounts.campaign;
        let tier = &ctx.accounts.tier;
        
        require!(campaign.is_active, ErrorCode::CampaignNotActive);
        require!(!campaign.is_finalized, ErrorCode::CampaignFinalized);
        require!(clock.unix_timestamp >= campaign.start_time, ErrorCode::CampaignNotStarted);
        require!(clock.unix_timestamp <= campaign.end_time, ErrorCode::CampaignEnded);
        require!(tier.tier_id == tier_id, ErrorCode::InvalidTier);
        require!(amount >= tier.min_amount, ErrorCode::AmountBelowMinimum);
        require!(tier.max_amount == 0 || amount <= tier.max_amount, ErrorCode::AmountAboveMaximum);
        require!(tier.max_backers == 0 || tier.current_backers < tier.max_backers, ErrorCode::TierFull);
        
        // Transfer SOL to vault
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.backer.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                },
            ),
            amount,
        )?;
        
        let backing = &mut ctx.accounts.backing;
        backing.bump = ctx.bumps.backing;
        backing.backer = ctx.accounts.backer.key();
        backing.campaign = ctx.accounts.campaign.key();
        backing.tier_id = tier_id;
        backing.amount = amount;
        backing.backed_at = clock.unix_timestamp;
        backing.is_refunded = false;
        
        let tier = &mut ctx.accounts.tier;
        tier.current_backers = tier.current_backers
            .checked_add(1)
            .ok_or(ErrorCode::MathOverflow)?;
        
        let campaign = &mut ctx.accounts.campaign;
        campaign.raised_amount = campaign.raised_amount
            .checked_add(amount)
            .ok_or(ErrorCode::MathOverflow)?;
        campaign.backers_count = campaign.backers_count
            .checked_add(1)
            .ok_or(ErrorCode::MathOverflow)?;
        
        Ok(())
    }

    pub fn back_campaign_token(
        ctx: Context<BackCampaignToken>,
        tier_id: u8,
        amount: u64,
    ) -> Result<()> {
        let clock = Clock::get()?;
        let campaign = &ctx.accounts.campaign;
        let tier = &ctx.accounts.tier;
        
        require!(campaign.is_active, ErrorCode::CampaignNotActive);
        require!(!campaign.is_finalized, ErrorCode::CampaignFinalized);
        require!(clock.unix_timestamp >= campaign.start_time, ErrorCode::CampaignNotStarted);
        require!(clock.unix_timestamp <= campaign.end_time, ErrorCode::CampaignEnded);
        require!(tier.tier_id == tier_id, ErrorCode::InvalidTier);
        require!(amount >= tier.min_amount, ErrorCode::AmountBelowMinimum);
        require!(tier.max_amount == 0 || amount <= tier.max_amount, ErrorCode::AmountAboveMaximum);
        require!(tier.max_backers == 0 || tier.current_backers < tier.max_backers, ErrorCode::TierFull);
        require!(campaign.currency_mint == ctx.accounts.currency_mint.key(), ErrorCode::InvalidMint);
        
        // Transfer tokens to vault
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.backer_token.to_account_info(),
                    to: ctx.accounts.vault_token.to_account_info(),
                    authority: ctx.accounts.backer.to_account_info(),
                },
            ),
            amount,
        )?;
        
        let backing = &mut ctx.accounts.backing;
        backing.bump = ctx.bumps.backing;
        backing.backer = ctx.accounts.backer.key();
        backing.campaign = ctx.accounts.campaign.key();
        backing.tier_id = tier_id;
        backing.amount = amount;
        backing.backed_at = clock.unix_timestamp;
        backing.is_refunded = false;
        
        let tier = &mut ctx.accounts.tier;
        tier.current_backers = tier.current_backers
            .checked_add(1)
            .ok_or(ErrorCode::MathOverflow)?;
        
        let campaign = &mut ctx.accounts.campaign;
        campaign.raised_amount = campaign.raised_amount
            .checked_add(amount)
            .ok_or(ErrorCode::MathOverflow)?;
        campaign.backers_count = campaign.backers_count
            .checked_add(1)
            .ok_or(ErrorCode::MathOverflow)?;
        
        Ok(())
    }

    pub fn finalize_campaign(ctx: Context<FinalizeCampaign>) -> Result<()> {
        let clock = Clock::get()?;
        let campaign = &ctx.accounts.campaign;
        
        require!(campaign.is_active, ErrorCode::CampaignNotActive);
        require!(!campaign.is_finalized, ErrorCode::CampaignAlreadyFinalized);
        require!(clock.unix_timestamp > campaign.end_time, ErrorCode::CampaignNotEnded);
        
        let campaign = &mut ctx.accounts.campaign;
        campaign.is_active = false;
        campaign.is_finalized = true;
        
        Ok(())
    }

    pub fn withdraw_funds_sol(ctx: Context<WithdrawFundsSol>) -> Result<()> {
        let campaign = &ctx.accounts.campaign;
        let config = &ctx.accounts.config;
        
        require!(campaign.is_finalized, ErrorCode::CampaignNotFinalized);
        require!(campaign.raised_amount >= campaign.goal_amount, ErrorCode::GoalNotReached);
        require!(campaign.farmer == ctx.accounts.farmer.key(), ErrorCode::Unauthorized);
        
        let vault_balance = ctx.accounts.vault.lamports();
        require!(vault_balance > 0, ErrorCode::NoFundsToWithdraw);
        
        let fee = vault_balance
            .checked_mul(config.fee_bps as u64)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(10000)
            .ok_or(ErrorCode::MathOverflow)?;
        
        let farmer_amount = vault_balance
            .checked_sub(fee)
            .ok_or(ErrorCode::MathOverflow)?;
        
        let farmer_key = ctx.accounts.farmer.key();
        let campaign_id_bytes = campaign.campaign_id.to_le_bytes();
        let bump = campaign.bump;
        
        let seeds = &[
            b"vault",
            farmer_key.as_ref(),
            campaign_id_bytes.as_ref(),
            &[bump],
        ];
        let signer_seeds: &[&[&[u8]]] = &[seeds];
        
        // Transfer fee to treasury
        if fee > 0 {
            system_program::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.system_program.to_account_info(),
                    system_program::Transfer {
                        from: ctx.accounts.vault.to_account_info(),
                        to: ctx.accounts.treasury.to_account_info(),
                    },
                    signer_seeds,
                ),
                fee,
            )?;
        }
        
        // Transfer remaining to farmer
        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.farmer.to_account_info(),
                },
                signer_seeds,
            ),
            farmer_amount,
        )?;
        
        let config = &mut ctx.accounts.config;
        config.total_raised = config.total_raised
            .checked_add(farmer_amount)
            .ok_or(ErrorCode::MathOverflow)?;
        
        Ok(())
    }

    pub fn withdraw_funds_token(ctx: Context<WithdrawFundsToken>) -> Result<()> {
        let campaign = &ctx.accounts.campaign;
        let config = &ctx.accounts.config;
        
        require!(campaign.is_finalized, ErrorCode::CampaignNotFinalized);
        require!(campaign.raised_amount >= campaign.goal_amount, ErrorCode::GoalNotReached);
        require!(campaign.farmer == ctx.accounts.farmer.key(), ErrorCode::Unauthorized);
        
        let vault_balance = ctx.accounts.vault_token.amount;
        require!(vault_balance > 0, ErrorCode::NoFundsToWithdraw);
        
        let fee = vault_balance
            .checked_mul(config.fee_bps as u64)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(10000)
            .ok_or(ErrorCode::MathOverflow)?;
        
        let farmer_amount = vault_balance
            .checked_sub(fee)
            .ok_or(ErrorCode::MathOverflow)?;
        
        let farmer_key = ctx.accounts.farmer.key();
        let campaign_id_bytes = campaign.campaign_id.to_le_bytes();
        let bump = ctx.bumps.vault_token;
        
        let seeds = &[
            b"vault_token",
            farmer_key.as_ref(),
            campaign_id_bytes.as_ref(),
            &[bump],
        ];
        let signer_seeds: &[&[&[u8]]] = &[seeds];
        
        // Transfer fee to treasury
        if fee > 0 {
            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.vault_token.to_account_info(),
                        to: ctx.accounts.treasury_token.to_account_info(),
                        authority: ctx.accounts.vault_token.to_account_info(),
                    },
                    signer_seeds,
                ),
                fee,
            )?;
        }
        
        // Transfer remaining to farmer
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_token.to_account_info(),
                    to: ctx.accounts.farmer_token.to_account_info(),
                    authority: ctx.accounts.vault_token.to_account_info(),
                },
                signer_seeds,
            ),
            farmer_amount,
        )?;
        
        let config = &mut ctx.accounts.config;
        config.total_raised = config.total_raised
            .checked_add(farmer_amount)
            .ok_or(ErrorCode::MathOverflow)?;
        
        Ok(())
    }

    pub fn claim_refund_sol(ctx: Context<ClaimRefundSol>) -> Result<()> {
        let campaign = &ctx.accounts.campaign;
        let backing = &ctx.accounts.backing;
        
        require!(campaign.is_finalized, ErrorCode::CampaignNotFinalized);
        require!(campaign.raised_amount < campaign.goal_amount, ErrorCode::GoalReached);
        require!(!backing.is_refunded, ErrorCode::AlreadyRefunded);
        require!(backing.backer == ctx.accounts.backer.key(), ErrorCode::Unauthorized);
        
        let refund_amount = backing.amount;
        
        let farmer_key = campaign.farmer;
        let campaign_id_bytes = campaign.campaign_id.to_le_bytes();
        let bump = campaign.bump;
        
        let seeds = &[
            b"vault",
            farmer_key.as_ref(),
            campaign_id_bytes.as_ref(),
            &[bump],
        ];
        let signer_seeds: &[&[&[u8]]] = &[seeds];
        
        system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.backer.to_account_info(),
                },
                signer_seeds,
            ),
            refund_amount,
        )?;
        
        let backing = &mut ctx.accounts.backing;
        backing.is_refunded = true;
        
        Ok(())
    }

    pub fn claim_refund_token(ctx: Context<ClaimRefundToken>) -> Result<()> {
        let campaign = &ctx.accounts.campaign;
        let backing = &ctx.accounts.backing;
        
        require!(campaign.is_finalized, ErrorCode::CampaignNotFinalized);
        require!(campaign.raised_amount < campaign.goal_amount, ErrorCode::GoalReached);
        require!(!backing.is_refunded, ErrorCode::AlreadyRefunded);
        require!(backing.backer == ctx.accounts.backer.key(), ErrorCode::Unauthorized);
        
        let refund_amount = backing.amount;
        
        let farmer_key = campaign.farmer;
        let campaign_id_bytes = campaign.campaign_id.to_le_bytes();
        let bump = ctx.bumps.vault_token;
        
        let seeds = &[
            b"vault_token",
            farmer_key.as_ref(),
            campaign_id_bytes.as_ref(),
            &[bump],
        ];
        let signer_seeds: &[&[&[u8]]] = &[seeds];
        
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault_token.to_account_info(),
                    to: ctx.accounts.backer_token.to_account_info(),
                    authority: ctx.accounts.vault_token.to_account_info(),
                },
                signer_seeds,
            ),
            refund_amount,
        )?;
        
        let backing = &mut ctx.accounts.backing;
        backing.is_refunded = true;
        
        Ok(())
    }
}

// ==================== ACCOUNT STRUCTURES ====================

#[account]
pub struct Config {
    pub bump: u8,
    pub authority: Pubkey,
    pub fee_bps: u16,
    pub total_campaigns: u64,
    pub total_raised: u64,
    pub is_active: bool,
    pub is_paused: bool,
    pub version: u8,
}

impl Config {
    pub const LEN: usize = 1 + 32 + 2 + 8 + 8 + 1 + 1 + 1;
}

#[account]
pub struct Campaign {
    pub bump: u8,
    pub farmer: Pubkey,
    pub campaign_id: u64,
    pub title: String,
    pub description: String,
    pub goal_amount: u64,
    pub raised_amount: u64,
    pub currency_mint: Pubkey,
    pub start_time: i64,
    pub end_time: i64,
    pub is_active: bool,
    pub is_finalized: bool,
    pub backers_count: u64,
    pub tiers_count: u8,
}

impl Campaign {
    pub const LEN: usize = 1 + 32 + 8 + (4 + 64) + (4 + 256) + 8 + 8 + 32 + 8 + 8 + 1 + 1 + 8 + 1;
}

#[account]
pub struct CampaignTier {
    pub bump: u8,
    pub campaign: Pubkey,
    pub tier_id: u8,
    pub name: String,
    pub min_amount: u64,
    pub max_amount: u64,
    pub benefits: String,
    pub max_backers: u32,
    pub current_backers: u32,
}

impl CampaignTier {
    pub const LEN: usize = 1 + 32 + 1 + (4 + 32) + 8 + 8 + (4 + 256) + 4 + 4;
}

#[account]
pub struct Backing {
    pub bump: u8,
    pub backer: Pubkey,
    pub campaign: Pubkey,
    pub tier_id: u8,
    pub amount: u64,
    pub backed_at: i64,
    pub is_refunded: bool,
}

impl Backing {
    pub const LEN: usize = 1 + 32 + 32 + 1 + 8 + 8 + 1;
}

// ==================== CONTEXT STRUCTS ====================

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(
        init,
        seeds = [b"config", authority.key().as_ref()],
        bump,
        payer = authority,
        space = 8 + Config::LEN
    )]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(campaign_id: u64)]
pub struct CreateCampaign<'info> {
    #[account(
        mut,
        seeds = [b"config", config.authority.as_ref()],
        bump = config.bump,
    )]
    pub config: Account<'info, Config>,
    #[account(
        init,
        seeds = [b"campaign", farmer.key().as_ref(), &campaign_id.to_le_bytes()],
        bump,
        payer = farmer,
        space = 8 + Campaign::LEN
    )]
    pub campaign: Account<'info, Campaign>,
    /// CHECK: SOL vault PDA for the campaign
    #[account(
        mut,
        seeds = [b"vault", farmer.key().as_ref(), &campaign_id.to_le_bytes()],
        bump,
    )]
    pub vault: AccountInfo<'info>,
    pub currency_mint: Account<'info, Mint>,
    #[account(mut)]
    pub farmer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(tier_id: u8)]
pub struct CreateTier<'info> {
    #[account(
        mut,
        seeds = [b"campaign", farmer.key().as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump = campaign.bump,
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(
        init,
        seeds = [b"tier", campaign.key().as_ref(), &[tier_id]],
        bump,
        payer = farmer,
        space = 8 + CampaignTier::LEN
    )]
    pub tier: Account<'info, CampaignTier>,
    #[account(mut)]
    pub farmer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(tier_id: u8)]
pub struct BackCampaignSol<'info> {
    #[account(
        mut,
        seeds = [b"campaign", campaign.farmer.as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump = campaign.bump,
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(
        mut,
        seeds = [b"tier", campaign.key().as_ref(), &[tier_id]],
        bump = tier.bump,
    )]
    pub tier: Account<'info, CampaignTier>,
    /// CHECK: SOL vault PDA
    #[account(
        mut,
        seeds = [b"vault", campaign.farmer.as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump,
    )]
    pub vault: AccountInfo<'info>,
    #[account(
        init,
        seeds = [b"backing", campaign.key().as_ref(), backer.key().as_ref()],
        bump,
        payer = backer,
        space = 8 + Backing::LEN
    )]
    pub backing: Account<'info, Backing>,
    #[account(mut)]
    pub backer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(tier_id: u8)]
pub struct BackCampaignToken<'info> {
    #[account(
        mut,
        seeds = [b"campaign", campaign.farmer.as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump = campaign.bump,
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(
        mut,
        seeds = [b"tier", campaign.key().as_ref(), &[tier_id]],
        bump = tier.bump,
    )]
    pub tier: Account<'info, CampaignTier>,
    #[account(
        init_if_needed,
        seeds = [b"vault_token", campaign.farmer.as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump,
        payer = backer,
        token::mint = currency_mint,
        token::authority = vault_token,
    )]
    pub vault_token: Account<'info, TokenAccount>,
    pub currency_mint: Account<'info, Mint>,
    #[account(
        mut,
        constraint = backer_token.mint == currency_mint.key(),
        constraint = backer_token.owner == backer.key(),
    )]
    pub backer_token: Account<'info, TokenAccount>,
    #[account(
        init,
        seeds = [b"backing", campaign.key().as_ref(), backer.key().as_ref()],
        bump,
        payer = backer,
        space = 8 + Backing::LEN
    )]
    pub backing: Account<'info, Backing>,
    #[account(mut)]
    pub backer: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalizeCampaign<'info> {
    #[account(
        mut,
        seeds = [b"campaign", campaign.farmer.as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump = campaign.bump,
    )]
    pub campaign: Account<'info, Campaign>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawFundsSol<'info> {
    #[account(
        mut,
        seeds = [b"config", config.authority.as_ref()],
        bump = config.bump,
    )]
    pub config: Account<'info, Config>,
    #[account(
        seeds = [b"campaign", farmer.key().as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump = campaign.bump,
    )]
    pub campaign: Account<'info, Campaign>,
    /// CHECK: SOL vault PDA
    #[account(
        mut,
        seeds = [b"vault", farmer.key().as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump,
    )]
    pub vault: AccountInfo<'info>,
    /// CHECK: Treasury account for platform fees
    #[account(mut)]
    pub treasury: AccountInfo<'info>,
    #[account(mut)]
    pub farmer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawFundsToken<'info> {
    #[account(
        mut,
        seeds = [b"config", config.authority.as_ref()],
        bump = config.bump,
    )]
    pub config: Account<'info, Config>,
    #[account(
        seeds = [b"campaign", farmer.key().as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump = campaign.bump,
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(
        mut,
        seeds = [b"vault_token", farmer.key().as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump,
        token::mint = currency_mint,
        token::authority = vault_token,
    )]
    pub vault_token: Account<'info, TokenAccount>,
    pub currency_mint: Account<'info, Mint>,
    #[account(
        mut,
        constraint = farmer_token.mint == currency_mint.key(),
        constraint = farmer_token.owner == farmer.key(),
    )]
    pub farmer_token: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = treasury_token.mint == currency_mint.key(),
    )]
    pub treasury_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub farmer: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimRefundSol<'info> {
    #[account(
        seeds = [b"campaign", campaign.farmer.as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump = campaign.bump,
    )]
    pub campaign: Account<'info, Campaign>,
    /// CHECK: SOL vault PDA
    #[account(
        mut,
        seeds = [b"vault", campaign.farmer.as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump,
    )]
    pub vault: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [b"backing", campaign.key().as_ref(), backer.key().as_ref()],
        bump = backing.bump,
    )]
    pub backing: Account<'info, Backing>,
    #[account(mut)]
    pub backer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimRefundToken<'info> {
    #[account(
        seeds = [b"campaign", campaign.farmer.as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump = campaign.bump,
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(
        mut,
        seeds = [b"vault_token", campaign.farmer.as_ref(), &campaign.campaign_id.to_le_bytes()],
        bump,
        token::mint = currency_mint,
        token::authority = vault_token,
    )]
    pub vault_token: Account<'info, TokenAccount>,
    pub currency_mint: Account<'info, Mint>,
    #[account(
        mut,
        constraint = backer_token.mint == currency_mint.key(),
        constraint = backer_token.owner == backer.key(),
    )]
    pub backer_token: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"backing", campaign.key().as_ref(), backer.key().as_ref()],
        bump = backing.bump,
    )]
    pub backing: Account<'info, Backing>,
    #[account(mut)]
    pub backer: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

// ==================== ERROR CODES ====================

#[error_code]
pub enum ErrorCode {
    #[msg("Math overflow occurred")]
    MathOverflow,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Invalid fee percentage")]
    InvalidFee,
    #[msg("Title too long (max 64 chars)")]
    TitleTooLong,
    #[msg("Description too long (max 256 chars)")]
    DescriptionTooLong,
    #[msg("Name too long (max 32 chars)")]
    NameTooLong,
    #[msg("Benefits too long (max 256 chars)")]
    BenefitsTooLong,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Invalid duration")]
    InvalidDuration,
    #[msg("Invalid tier range")]
    InvalidTierRange,
    #[msg("Platform is inactive")]
    PlatformInactive,
    #[msg("Campaign is not active")]
    CampaignNotActive,
    #[msg("Campaign is already finalized")]
    CampaignFinalized,
    #[msg("Campaign has not started yet")]
    CampaignNotStarted,
    #[msg("Campaign has ended")]
    CampaignEnded,
    #[msg("Campaign has not ended yet")]
    CampaignNotEnded,
    #[msg("Campaign is not finalized")]
    CampaignNotFinalized,
    #[msg("Campaign already finalized")]
    CampaignAlreadyFinalized,
    #[msg("Invalid tier")]
    InvalidTier,
    #[msg("Amount below minimum")]
    AmountBelowMinimum,
    #[msg("Amount above maximum")]
    AmountAboveMaximum,
    #[msg("Tier is full")]
    TierFull,
    #[msg("Invalid mint")]
    InvalidMint,
    #[msg("Goal not reached")]
    GoalNotReached,
    #[msg("Goal was reached, no refunds available")]
    GoalReached,
    #[msg("Already refunded")]
    AlreadyRefunded,
    #[msg("No funds to withdraw")]
    NoFundsToWithdraw,
}