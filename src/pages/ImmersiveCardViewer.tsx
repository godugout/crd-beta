
// In the JSX where stats are displayed:
{card.stats?.battingAverage && <span className="text-sm">{card.stats.battingAverage}</span>}
{card.stats?.homeRuns && <span className="text-sm">{card.stats.homeRuns}</span>}
{card.stats?.rbis && <span className="text-sm">{card.stats.rbis}</span>}
{card.stats?.era && <span className="text-sm">{card.stats.era}</span>}
{card.stats?.wins && <span className="text-sm">{card.stats.wins}</span>}
{card.stats?.strikeouts && <span className="text-sm">{card.stats.strikeouts}</span>}
{card.stats?.careerYears && <span className="text-sm">{card.stats.careerYears}</span>}
{card.stats?.ranking && <span className="text-sm">{card.stats.ranking}</span>}
