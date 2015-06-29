var http = require("httpplease");
var apijs = require("tnt.api");
var promises = require('httpplease-promises');
var Promise = require('es6-promise').Promise;
var json = require("httpplease/plugins/json");
http = http.use(json).use(promises(Promise));

tnt_eRest = function() {

    var config = {
        proxyUrl : "https://rest.ensembl.org"
    };
    // Prefixes to use the REST API.
    //var proxyUrl = "https://rest.ensembl.org";
    //var prefix_region = prefix + "/overlap/region/";
    //var prefix_ensgene = prefix + "/lookup/id/";
    //var prefix_xref = prefix + "/xrefs/symbol/";
    //var prefix_homologues = prefix + "/homology/id/";
    //var prefix_chr_info = prefix + "/info/assembly/";
    //var prefix_aln_region = prefix + "/alignment/region/";
    //var prefix_gene_tree = prefix + "/genetree/id/";
    //var prefix_assembly = prefix + "/info/assembly/";
    //var prefix_sequence = prefix + "/sequence/region/";
    //var prefix_variation = prefix + "/variation/";

    // Number of connections made to the database
    var connections = 0;

    var eRest = function() {
    };

    // Limits imposed by the ensembl REST API
    eRest.limits = {
        region : 5000000
    };

    var api = apijs (eRest);

    api.getset (config);

    /** <strong>call</strong> makes an asynchronous call to the ensembl REST service.
	@param {Object} object - A literal object containing the following fields:
	<ul>
	<li>url => The rest URL. This is returned by {@link eRest.url}</li>
	<li>success => A callback to be called when the REST query is successful (i.e. the response from the server is a defined value and no error has been returned)</li>
	<li>error => A callback to be called when the REST query returns an error
	</ul>
    */
    api.method ('call', function (myurl, data) {
	if (data) {
	    return http.post({
		"url": myurl,
		"body" : data
	    })
	}
	return http.get({
	    "url": myurl
	});
    });
    // api.method ('call', function (obj) {
    // 	var url = obj.url;
    // 	var on_success = obj.success;
    // 	var on_error   = obj.error;
    // 	connections++;
    // 	http.get({
    // 	    "url" : url
    // 	}, function (error, resp) {
    // 	    if (resp !== undefined && error == null && on_success !== undefined) {
    // 		on_success(JSON.parse(resp.body));
    // 	    }
    // 	    if (error !== null && on_error !== undefined) {
    // 		on_error(error);
    // 	    }
    // 	});
    // });


    eRest.url = {};
    var url_api = apijs (eRest.url);
	/** eRest.url.<strong>region</strong> returns the ensembl REST url to retrieve the genes included in the specified region
	    @param {object} obj - An object literal with the following fields:<br />
<ul>
<li>species : The species the region refers to</li>
<li>chr     : The chr (or seq_region name)</li>
<li>from    : The start position of the region in the chr</li>
<li>to      : The end position of the region (from < to always)</li>
</ul>
            @returns {string} - The url to query the Ensembl REST server. For an example of output of these urls see the {@link http://beta.rest.ensembl.org/feature/region/homo_sapiens/13:32889611-32973805.json?feature=gene|Ensembl REST API example}
	    @example
eRest.call ( url     : eRest.url.region ({ species : "homo_sapiens", chr : "13", from : 32889611, to : 32973805 }),
             success : callback,
             error   : callback
	   );
	 */
     url_api.method ('region', function(obj) {
         var prefix_region = "/overlap/region/";
         var features = obj.features || ["gene"];
         var feature_options = features.map (function (d) {
             return "feature=" + d;
         });
         var feature_options_url = feature_options.join("&");
         return config.proxyUrl + prefix_region +
         obj.species +
         "/" +
         obj.chr +
         ":" +
         obj.from +
         "-" + obj.to +
         //".json?feature=gene";
         ".json?" + feature_options_url;
     });

	/** eRest.url.<strong>species_gene</strong> returns the ensembl REST url to retrieve the ensembl gene associated with
	    the given name in the specified species.
	    @param {object} obj - An object literal with the following fields:<br />
<ul>
<li>species   : The species the region refers to</li>
<li>gene_name : The name of the gene</li>
</ul>
            @returns {string} - The url to query the Ensembl REST server. For an example of output of these urls see the {@link http://beta.rest.ensembl.org/xrefs/symbol/human/BRCA2.json?object_type=gene|Ensembl REST API example}
	    @example
eRest.call ( url     : eRest.url.species_gene ({ species : "human", gene_name : "BRCA2" }),
             success : callback,
             error   : callback
	   );
	 */
    url_api.method ('xref', function (obj) {
        var prefix_xref = "/xrefs/symbol/";
        return config.proxyUrl + prefix_xref +
            obj.species  +
            "/" +
            obj.name +
            ".json?object_type=gene";
    });

	/** eRest.url.<strong>homologues</strong> returns the ensembl REST url to retrieve the homologues (orthologues + paralogues) of the given ensembl ID.
	    @param {object} obj - An object literal with the following fields:<br />
<ul>
<li>id : The Ensembl ID of the gene</li>
</ul>
            @returns {string} - The url to query the Ensembl REST server. For an example of output of these urls see the {@link http://beta.rest.ensembl.org/homology/id/ENSG00000139618.json?format=condensed;sequence=none;type=all|Ensembl REST API example}
	    @example
eRest.call ( url     : eRest.url.homologues ({ id : "ENSG00000139618" }),
             success : callback,
             error   : callback
	   );
	 */
    url_api.method ('homologues', function(obj) {
        var prefix_homologues = obj.member_id === undefined ? "/homology/id/" : "/homology/member/id/";
        var id = obj.member_id || obj.id;
        return config.proxyUrl + prefix_homologues +
            id +
            ".json?format=condensed;sequence=none;type=all";
    });

	/** eRest.url.<strong>gene</strong> returns the ensembl REST url to retrieve the ensembl gene associated with
	    the given ID
	    @param {object} obj - An object literal with the following fields:<br />
<ul>
<li>id : The name of the gene</li>
<li>expand : if transcripts should be included in the response (default to 0)</li>
</ul>
            @returns {string} - The url to query the Ensembl REST server. For an example of output of these urls see the {@link http://beta.rest.ensembl.org/lookup/ENSG00000139618.json?format=full|Ensembl REST API example}
	    @example
eRest.call ( url     : eRest.url.gene ({ id : "ENSG00000139618" }),
             success : callback,
             error   : callback
	   );
	 */
    url_api.method ('gene', function(obj) {
        var prefix_ensgene = "/lookup/id/";
        var url = config.proxyUrl + prefix_ensgene + obj.id + ".json?format=full";
        if (obj.expand && obj.expand === 1) {
            url = url + "&expand=1";
        }
        return url;
    });

	/** eRest.url.<strong>chr_info</strong> returns the ensembl REST url to retrieve the information associated with the chromosome (seq_region in Ensembl nomenclature).
	    @param {object} obj - An object literal with the following fields:<br />
<ul>
<li>species : The species the chr (or seq_region) belongs to
<li>chr     : The name of the chr (or seq_region)</li>
</ul>
            @returns {string} - The url to query the Ensembl REST server. For an example of output of these urls see the {@link http://beta.rest.ensembl.org/assembly/info/homo_sapiens/13.json?format=full|Ensembl REST API example}
	    @example
eRest.call ( url     : eRest.url.chr_info ({ species : "homo_sapiens", chr : "13" }),
             success : callback,
             error   : callback
	   );
	 */
    url_api.method ('chr_info', function(obj) {
        var prefix_chr_info = "/info/assembly/";
        return config.proxyUrl + prefix_chr_info +
            obj.species +
            "/" +
            obj.chr +
            ".json?format=full";
    });

	// TODO: For now, it only works with species_set and not species_set_groups
	// Should be extended for wider use
    url_api.method ('aln_block', function (obj) {
        var prefix_aln_region = "/alignment/region/";
        var url = config.proxyUrl + prefix_aln_region +
            obj.species +
            "/" +
            obj.chr +
            ":" +
            obj.from +
            "-" +
            obj.to +
            ".json?method=" +
            obj.method;

        for (var i=0; i<obj.species_set.length; i++) {
            url += "&species_set=" + obj.species_set[i];
        }

        return url;
    });

    url_api.method ('sequence', function (obj) {
        var prefix_sequence = "/sequence/region/";
        return config.proxyUrl + prefix_sequence +
            obj.species +
            '/' +
            obj.chr +
            ':' +
            obj.from +
            '..' +
            obj.to +
            '?content-type=application/json';
    });

    url_api.method ('variation', function (obj) {
	// For now, only post requests are included
        var prefix_variation = "/variation/";
        return config.proxyUrl + prefix_variation +
            obj.species;
        });

    url_api.method ('gene_tree', function (obj) {
        var prefix_gene_tree = "/genetree/id/";
        return config.proxyUrl + prefix_gene_tree +
            obj.id +
            ".json?sequence=" +
            ((obj.sequence || obj.aligned) ? 1 : "none") +
            (obj.aligned ? '&aligned=1' : '');
    });

    url_api.method('assembly', function (obj) {
        var prefix_assembly = "/info/assembly/";
        return config.proxyUrl + prefix_assembly +
            obj.species +
            ".json";
        });


    api.method ('connections', function() {
	return connections;
    });

    return eRest;
};

module.exports = exports = tnt_eRest;
