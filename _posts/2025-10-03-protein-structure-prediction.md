---
title: "An Overview of Machine Learning Models for NCAA and PTM modeling"
published: true
date: 2026-05-17
permalink: /posts/2026/05/ncaa-ptm-ml-overview/
tags:
  - protein structure
  - machine learning
  - NCAAs
  - PTMs
  - structural biology
categories:
  - Research
---

AlphaFold 2 [1] has largely solved the problem of predicting the 3D structure of proteins from their amino acid sequences, though there is still debate over the extent to which this problem is truly solved — a view I share. AlphaFold 3 [2] and a number of subsequent models [3,4,5] have extended this success to protein complexes and proteins with small-molecule binders. However, all of these are primarily designed for canonical amino acids (CAAs) and do not account for non-canonical amino acids (NCAAs). Given that NCAAs play an increasingly important role in drug discovery and protein engineering, it is crucial to review the current state of machine learning models for predicting the structure of proteins containing NCAAs and post-translational modifications (PTMs). In this post, I review the recent progress in this field, with a critical view on the extent to which these models offer fruitful solutions.

**PepLand** [6] proposes a solution that sits between small molecules and larger peptides: a multi-view heterogeneous graph neural network (GNN) pre-trained by partial graph self-reconstruction. The model is trained in a three-stage setup: first on a large corpus of canonical peptide sequences, then on a smaller dataset of peptides containing NCAAs, and finally fine-tuned on labelled data for each downstream task. The first-stage pre-training data come from UniProt, while the second-stage NCAA data come from CycPeptMPDB combined with non-canonical peptides from the PDB, totalling 8,977 NCAA training samples. The model is evaluated by fine-tuning on the benchmark datasets, and reaches a Spearman correlation of 0.768 on the nc-Binding task after fine-tuning. Notably, nearly all of this performance comes from the fine-tuning stage itself: an untrained head on the frozen PepLand encoder achieves only ~0.2, raising the question of how much of the reported gain actually originates from the pretrained representation rather than from task-specific supervised learning.

Critically, the model takes 2D information as input, making it intrinsically unable to make finer predictions that depend on peptide conformation. Moreover, the reliance on fine-tuning leaves the model's underlying capacity uncertain, since performance can be heavily influenced by the data-splitting strategy. That said, the evaluation benchmark itself is a useful contribution. I am also curious about its performance on other NCAA peptide benchmarks such as [7].

**PepTune** [8] proposes a Masked Diffusion Language Model (MDLM) for generating peptide SMILES, with peptide-specific loss terms and masking schedules designed to improve structural validity. The paper also introduces Monte Carlo Tree Guidance (MCTG), an inference-time search method for multi-objective optimization during sampling. While the method is technically interesting as a discrete generative modeling framework, its evaluation is relatively limited from a therapeutic peptide design perspective. Many of the reported metrics, such as validity, uniqueness, and diversity, mainly measure generative hygiene rather than biological usefulness. The downstream optimization also relies heavily on learned property predictors, whose reliability is inherently limited by the quality, coverage, and splitting strategy of the training data. In the final application, the authors claim to generate GLP-1R binders with better docking scores than semaglutide and liraglutide, but docking score is a noisy computational proxy and should not be interpreted as evidence of better real-world agonistic activity. More generally, the paper provides limited direct evaluation of its ability to generate useful non-canonical amino acid-containing peptides, and its biological conclusions are difficult to assess without structural conditioning, stronger leakage controls, or experimental validation.


## References

1. Jumper J, Evans R, Pritzel A, Green T, Figurnov M, Ronneberger O, Tunyasuvunakool K, Bates R, Žídek A, Potapenko A, et al. *Highly accurate protein structure prediction with AlphaFold.* **Nature**, 596, 583–589 (2021). [https://doi.org/10.1038/s41586-021-03819-2](https://doi.org/10.1038/s41586-021-03819-2)

2. Abramson J, Adler J, Dunger J, Evans R, Green T, Pritzel A, Ronneberger O, Willmore L, Ballard AJ, Bambrick J, et al. *Accurate structure prediction of biomolecular interactions with AlphaFold 3.* **Nature**, 630, 493–500 (2024). [https://doi.org/10.1038/s41586-024-07487-w](https://doi.org/10.1038/s41586-024-07487-w)

3. Passaro S, Corso G, Wohlwend J, Reveiz M, Thaler S, Somnath VR, Getz N, Portnoi T, Roy J, Stark H, Kwabi-Addo D, Beaini D, Jaakkola T, Barzilay R. *Boltz-2: Towards Accurate and Efficient Binding Affinity Prediction.* **bioRxiv** 2025.06.14.659707 (2025). [https://doi.org/10.1101/2025.06.14.659707](https://doi.org/10.1101/2025.06.14.659707)

4. Cho Y, Pacesa M, Zhang Z, Correia BE, Ovchinnikov S. *BoltzDesign1: Inverting All-Atom Structure Prediction Model for Generalized Biomolecular Binder Design.* **bioRxiv** 2025.04.06.647261 (2025). [https://doi.org/10.1101/2025.04.06.647261](https://doi.org/10.1101/2025.04.06.647261)

5. The OpenFold3 Team. *OpenFold3-preview2 Technical Report.* OpenFold Consortium (2025). [Technical report](https://portal.openfold.omsf.io/reports/of3p2_technical_report.pdf); software DOI [10.5281/zenodo.19001000](https://doi.org/10.5281/zenodo.19001000).

6. Zhang R, Wu H, Liu C, Yang Q, Xiu Y, Li K, Chen N, Wang Y, Wang Y, Gao X, Zhou F. *PepLand: a large-scale pre-trained peptide representation model for a comprehensive landscape of both canonical and non-canonical amino acids.* **Briefings in Bioinformatics**, 26(4), bbaf367 (July 2025). [https://doi.org/10.1093/bib/bbaf367](https://doi.org/10.1093/bib/bbaf367)

7. Rogers JM, Passioura T, Suga H. *Nonproteinogenic deep mutational scanning of linear and cyclic peptides.* **Proceedings of the National Academy of Sciences**, 115(43), 10959–10964 (2018). [https://doi.org/10.1073/pnas.1809901115](https://doi.org/10.1073/pnas.1809901115)

8. Tang, S., Zhang, Y., & Chatterjee, P. (2025). PepTune: De Novo Generation of Therapeutic Peptides with Multi-Objective-Guided Discrete Diffusion. Proceedings of the 42nd International Conference on Machine Learning, PMLR 267.