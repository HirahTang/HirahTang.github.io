---
title: "What Can Machine Learning Tell Us About Noncanonical Peptides?"
published: true
date: 2026-05-17
permalink: /posts/2026/05/ncaa-ptm-ml-overview/
excerpt: "Representing a modified peptide, generating one, and predicting whether it will work are different achievements. What evidence connects them?"
tags:
  - protein structure
  - machine learning
  - NCAAs
  - PTMs
  - structural biology
categories:
  - Research
---

Suppose we already have a peptide that binds its target. We want to change one residue to improve another property, while keeping that binding intact. Which chemical change should we try first?

This is the design problem I have in mind when reading about machine learning for noncanonical amino acids (NCAAs). Once we move beyond the usual amino acid alphabet, we need a model to describe the actual chemistry of a residue. But describing a molecule is only the beginning. The useful prediction is what happens when we change it.

The progress in protein structure prediction makes this an exciting question. AlphaFold 2 changed what we can infer from a sequence,[^af2] and AlphaFold 3 extended prediction to a much wider range of molecular interactions.[^af3] Crucially, newer models already support modified chemistry: AlphaFold 3 handles modified residues, and Boltz and OpenFold3 also provide ways to specify noncanonical residues.[^inputs] Their support for such inputs gives us a starting point. It does not, by itself, establish how reliably they can predict the effect of a new substitution on binding or function.

For me, that distinction connects several otherwise quite different papers. A useful representation, a plausible generated peptide, and a reliable prediction of experimental activity are separate achievements. The limitations of each approach matter because they determine which design decisions its results can support.

## Learning the chemistry

A peptide representation needs to distinguish chemical changes that a conventional sequence alphabet cannot express. PepLand tackles this through molecular graphs, learning from canonical peptides before further pretraining on noncanonical chemistry. Its benchmarks cover properties such as permeability and binding, bringing modified peptides into the same evaluation framework as canonical ones.[^pepland]

The reported Spearman correlation of 0.768 on its nc-Binding benchmark is encouraging. The supplement describes linear probing: a supervised predictor is trained on features extracted from the pretrained model. That is evidence that the learned representation contains useful information, and the pretraining ablations help assess how its training stages contribute.[^pepland]

My main reservation about PepLand for substitution design is its lack of explicit conditioning on a particular bound conformation. A molecular graph specifies atoms and bonds, and a model can learn correlations with conformation-dependent properties. But the benchmark score alone does not settle whether it can distinguish subtle chemical changes at a specific interface. I would want evaluations that hold out peptide scaffolds or residue families, because the split determines how strongly we can claim generalization to unfamiliar chemistry.

## What does a better generated peptide mean?

That question becomes more consequential when the model starts proposing molecules. We can check whether a generated peptide is chemically valid, novel, or diverse. These are useful checks: an invalid molecule cannot become an experimental candidate. The harder step is showing that a better computational score leads to a better peptide.

PepTune makes this step especially visible. It generates peptide SMILES through masked diffusion, then uses Monte Carlo Tree Guidance to search for candidates with several desirable predicted properties. The paper evaluates noncanonical residue usage and cyclic peptide generation as well as validity and diversity, so its contribution goes beyond generating ordinary peptide sequences.[^peptune]

The limitation I see is the dependence of that search on learned property predictors: errors in a predictor can affect which molecules the search recommends. How much confidence to place in those candidates depends on the predictors' training coverage and evaluation splits. I would especially want to see whether they remain reliable on the unfamiliar chemistry that generation is meant to explore.

Its GLP-1R example also illustrates the limits of computational evaluation. The generated candidates receive more favorable docking scores than the semaglutide and liraglutide controls used in the study. Those scores help formulate a hypothesis about binding. They do not establish stronger binding experimentally, and they cannot establish receptor agonism. The paper reports no wet-lab assays of these candidates.[^peptune]

HELM-GPT illustrates the same dependence on predicted properties, using HELM to specify monomers and their connections. It uses learned predictors to guide macrocyclic peptides toward improved permeability and KRAS binding scores. The study reports no experimental validation of those generated candidates, so the proposed improvements remain computational predictions.[^helm] My confidence in them therefore depends on how well the property predictors generalize to the chemistry that optimization explores.

GPepT provides a small experimental bridge. After generating peptidomimetics from a model fine-tuned for antimicrobial activity, the authors selected five candidates using availability and synthesis criteria. Three were synthesized and tested; one showed activity against *E. coli*.[^gpept] The small, selected set limits what we can conclude: it does not establish a prospective synthesis success rate, an experimental activity distribution, or a hit rate across model outputs.

These results make generation interesting to me as a way to choose experiments. A prospective test would follow a stated candidate-selection rule and report the outcomes across the tested set, including unsuccessful candidates. Stating the rule in advance would help us judge how much the model improves candidate selection, alongside the chemist's judgment.

## Bringing the structure back in

For a substitution in an existing binder, there is another source of information: the complex itself. A bound structure gives us a way to examine whether a new side chain might fit, make a contact, or disrupt an interaction. The challenge is representing unfamiliar residues and scoring their effects accurately.

Holden and colleagues used AutoRotLib to parameterize NCAAs for Rosetta calculations on the PUMA–MCL-1 and CP2–KDM4 systems. They compared computed substitution effects with experimental data, including classifications of stabilizing and destabilizing changes. Agreement varied across positions, and canonical substitutions generally performed better than noncanonical ones.[^autorotlib] This is a valuable test because the prediction is tied directly to the substitution decision. Its limitation is the accuracy of the resulting Rosetta calculation: providing residue parameters and rotamer libraries does not guarantee that the energy model and sampled conformations capture the experimental effect.

FakeRotLib makes NCAA parameterization faster, with publicly available code. Its published benchmarks chiefly assess rotamer and sequence recovery using canonical residues under alternative parameterization schemes.[^fakerotlib] That evaluation is its limitation for the question here: it demonstrates a way to prepare calculations more efficiently, but does not establish improved prediction of experimental NCAA substitution effects.

## The evidence I would like to see

The most useful evaluation depends on the decision we want a model to support. If I am choosing substitutions for an existing binder, I care about whether it ranks those changes correctly. If I am generating a new scaffold, I care about whether the selected candidates can be synthesized and show the intended activity.

For substitution prediction, the nonproteinogenic deep mutational scanning work of Rogers and colleagues is particularly relevant: it measures the effects of many chemical changes within the same peptide systems.[^dms] I would like to see more models evaluated on such experimentally grounded comparisons, with training overlap checked and performance reported for unfamiliar scaffolds and residue types.

I am optimistic about tools that help us explore more of peptide chemistry. My strongest interest is in connecting that exploration to a concrete experiment: a substitution worth making, a candidate worth synthesizing, or a prediction we can test. That connection is where I would look for the next convincing advance.

## References

[^af2]: Jumper, J., et al. (2021). [Highly accurate protein structure prediction with AlphaFold](https://doi.org/10.1038/s41586-021-03819-2). *Nature*, 596, 583–589.

[^af3]: Abramson, J., et al. (2024). [Accurate structure prediction of biomolecular interactions with AlphaFold 3](https://doi.org/10.1038/s41586-024-07487-w). *Nature*, 630, 493–500.

[^inputs]: Official input documentation: [AlphaFold 3 residue modifications](https://github.com/google-deepmind/alphafold3/blob/main/docs/input.md), [Boltz modifications](https://github.com/jwohlwend/boltz/blob/main/docs/prediction.md), and [OpenFold3 0.4.0 features](https://pypi.org/project/openfold3/0.4.0/). OpenFold3-preview2 was released in 2026; see its [release record](https://github.com/aqlaboratory/openfold-3/releases/tag/0.4.0) and [technical report](https://portal.openfold.omsf.io/reports/of3p2_technical_report.pdf).

[^pepland]: Zhang, R., et al. (2025). [PepLand: A large-scale pre-trained peptide representation model for a comprehensive landscape of both canonical and non-canonical amino acids](https://doi.org/10.1093/bib/bbaf367). *Briefings in Bioinformatics*, 26(4), bbaf367. See also the supplementary methods and pretraining ablations.

[^peptune]: Tang, S., Zhang, Y., & Chatterjee, P. (2025). [PepTune: De novo generation of therapeutic peptides with multi-objective-guided discrete diffusion](https://proceedings.mlr.press/v267/tang25n.html). *Proceedings of the 42nd International Conference on Machine Learning*, PMLR 267.

[^helm]: Xu, X., et al. (2024). [HELM-GPT: De novo macrocyclic peptide design using generative pre-trained transformer](https://doi.org/10.1093/bioinformatics/btae364). *Bioinformatics*, 40(6), btae364.

[^gpept]: Oikawa, Y., et al. (2025). [GPepT: A foundation language model for peptidomimetics incorporating noncanonical amino acids](https://doi.org/10.1021/acsmedchemlett.5c00375). *ACS Medicinal Chemistry Letters*, 16, 1670–1675.

[^autorotlib]: Holden, J. K., et al. (2022). [Computational site saturation mutagenesis of canonical and non-canonical amino acids to probe protein-peptide interactions](https://doi.org/10.3389/fmolb.2022.848689). *Frontiers in Molecular Biosciences*, 9, 848689.

[^fakerotlib]: Bell, E. W., Brown, B. P., & Meiler, J. (2025). [FakeRotLib: Expedient non-canonical amino acid parameterization in Rosetta](https://doi.org/10.1021/acs.jcim.5c01030). *Journal of Chemical Information and Modeling*, 65(16), 8397–8404.

[^dms]: Rogers, J. M., Passioura, T., & Suga, H. (2018). [Nonproteinogenic deep mutational scanning of linear and cyclic peptides](https://doi.org/10.1073/pnas.1809901115). *Proceedings of the National Academy of Sciences*, 115(43), 10959–10964.
